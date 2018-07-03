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

因为在 Golang 中 AES 已经有了现成的模块，所以我们可以很简单的就可以使用 AES 来进行加密:

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
