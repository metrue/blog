# AES in Golang

AES 是 Advanced Encryption Standard 是缩写，是一种对称式的加密算法。AES 的区块 block 长度是固定的 128 位:

```
// The AES block size in bytes.
const BlockSize = 16
```
上面这段代码是在 [Golang 的源代码中](https://github.com/golang/go/blob/master/src/crypto/aes/cipher.go#L15), `16 * 8 = 128`

而密钥 key 的长度可以是 128, 192 和 256. 所以你也可以在 Golang 的[相关代码中](https://github.com/golang/go/blob/master/src/crypto/aes/cipher.go#L33)看到相关的定义。这也就是我们为什么经常看到 AES-128, AES-192, 以及 AES-256 原因，后缀的数字128, 192, 256 指的就是 key 的长度.


AES 有如下几种模式:

> 需要填充的模式
* Electronic Codebook (ECB): 带加密的信息被分割成 blocks，然后 blocks 分别被单独加密. 这种模式的缺点是缺乏混淆性, 因为相同的 Plain Text block 会被加密成相同的 Cipher Text block. 所以数据模式的隐藏性很低。在大部分的加密场景都不推荐使用。
* Cipher Block Chaining (CBC): CBC 在对信息进行加密的时候，Initial Value (IV) 需要随机的产生. 改信息的任何一部分都需要重新进行整个加密. 解密可以并行的进行.

> 流式的加密模式

* Couter (CTR): CTR 的加密和解密都可以完全的并行。
* Output Feedback (OFB): OFB 的加密和解密都能并行.
* Cipher Feedback (CFB): OFB 的解密是并行的，但是加密不是。

> 身份验证加密模式

* Counter with CBC-MAC (CCM): 这种模式是 CTR 和 CBC-MAC 的简单组合, 性能较差。
* Offset Codebook Mode (OCB): 速度很快但是有专利限制.
* Galosi/Counter Model (GCM): GCM 是 CTR 和 GHASH 的复杂组合，速度很快，但是复杂性高。

这么多中模式，我们在工程中应该选择哪一种呢，有一个回答我十分赞同:
>Considering the importance of authentication I would recommend the following two block cipher modes for most use cases (except for disk encryption purposes): If the data is authenticated by an asymmetric signature use CBC, otherwise use GCM.
简单来说就是除非数据是通过非对称签名进行验证，则使用 CBC, 否则使用 GCM。

### CBC

因为在 Golang 中 AES 已经有了现成的模块，所以我们可以很简单的就可以使用 AES 来进行加密, CBC 在输入不满足 `aes.BlockSize` 的倍数的时候，需要做填充.

```
func Pad(src []byte) []byte {
	padding := aes.BlockSize - len(src)%aes.BlockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(src, padtext...)
}

func Unpad(src []byte) ([]byte, error) {
	length := len(src)
	unpadding := int(src[length-1])

	if unpadding > length {
		return src, nil
	}
	return src[:(length - unpadding)], nil
}
```

使用 `KEY` 和 `IV` 来进行加解密.

```
// Encrypt AES CBC mode
func Encrypt(key, iv, plaintext []byte) ([]byte, error) {
	if len(plaintext)%aes.BlockSize != 0 {
		plaintext = Pad(plaintext)
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	cbc := cipher.NewCBCEncrypter(block, iv)
	cbc.CryptBlocks(ciphertext[aes.BlockSize:], plaintext)

	return ciphertext, nil
}

// Decrypt AES CBC mode
func Decrypt(key, iv, ciphertext []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	if len(ciphertext) < aes.BlockSize {
		return nil, fmt.Errorf("ciphertext too short")
	}

	ciphertext = ciphertext[aes.BlockSize:]

	cbc := cipher.NewCBCDecrypter(block, []byte(iv))
	plaintext := make([]byte, len(ciphertext))
	cbc.CryptBlocks(plaintext, ciphertext)

	if plaintext, err = Unpad(plaintext); err != nil {
		return nil, err
	}

	return plaintext, nil
}
```

### GCM

* Encrypt

```
func Encrypt(plaintext []byte, key *[32]byte) (ciphertext []byte, err error) {
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := make([]byte, gcm.NonceSize())
	_, err = io.ReadFull(rand.Reader, nonce)
	if err != nil {
		return nil, err
	}

	return gcm.Seal(nonce, nonce, plaintext, nil), nil
}
```

* Decrypt

```
func Decrypt(ciphertext []byte, key *[32]byte) (plaintext []byte, err error) {
	block, err := aes.NewCipher(key[:])
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	if len(ciphertext) < gcm.NonceSize() {
		return nil, errors.New("malformed ciphertext")
	}

	return gcm.Open(nil,
		ciphertext[:gcm.NonceSize()],
		ciphertext[gcm.NonceSize():],
		nil,
	)
}
```

### KEY, IV, Nonce

* KEY

KEY 当然是很重要的了，是一个你必须保密的东西。也许这就是为什么人们喜欢取名 `XXX_SECRET_KEY` 的原因。在对称加密的情况下一般只要知道加密数据的 KEY, 就可以解密出来. 在非对称加密的时候，`KEY` 由两部分: `public key` 和 `private key`. `public key` 用来解密和检查签名, 而 `private key` 用来加密签名。

* IV

IV 是 `initialization vector` 的缩写, 字面上意思是初始向量，作为加密迭代的初始输入。 IV 在不同的上下文有不太一样的意思, 但是大多数快加密操作中，`IV` 应该需要随机产生和不可预测的.

* Nonce

Nonce 就是 'a number used only once', 所以一个 nonce 应该且只能使用一次。
