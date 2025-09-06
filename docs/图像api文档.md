
# API参考

对于服务提供的主要操作：

- HTTP请求方法为POST。
- 请求体和响应体均为JSON数据（JSON对象）。
- 当请求处理成功时，响应状态码为 `200` ，响应体的属性如下：

| 名称 | 类型 | 含义 |
| --- | --- | --- |
| `logId` | `string` | 请求的UUID。 |
| `errorCode` | `integer` | 错误码。固定为 `0` 。 |
| `errorMsg` | `string` | 错误说明。固定为 `"Success"` 。 |
| `result` | `object` | 操作结果。 |

- 当请求处理未成功时，响应体的属性如下：

| 名称 | 类型 | 含义 |
| --- | --- | --- |
| `logId` | `string` | 请求的UUID。 |
| `errorCode` | `integer` | 错误码。与响应状态码相同。 |
| `errorMsg` | `string` | 错误说明。 |

服务提供的主要操作如下：

- **`infer`**

对图像进行分类。

`POST /image-classification`

- 请求体的属性如下：

| 名称 | 类型 | 含义 | 是否必填 |
| --- | --- | --- | --- |
| `image` | `string` | 服务器可访问的图像文件的URL或图像文件内容的Base64编码结果。 | 是 |
| `topk` | `integer` \| `null` | 请参阅产线对象中 `predict` 方法的 `topk` 参数相关说明。 | 否 |

- 请求处理成功时，响应体的 `result` 具有如下属性：

| 名称 | 类型 | 含义 |
| --- | --- | --- |
| `categories` | `array` | 图像类别信息。 |
| `image` | `string` \| `null` | 图像分类结果图。图像为JPEG格式，使用Base64编码。 |

`categories` 中的每个元素为一个 `object` ，具有如下属性：

| 名称 | 类型 | 含义 |
| --- | --- | --- |
| `id` | `integer` | 类别ID。 |
| `name` | `string` | 类别名称。 |
| `score` | `number` | 类别得分。 |

`result` 示例如下：

```json
{
"categories": [
{
"id": 5,
"name": "兔子",
"score": 0.93
}
],
"image": "xxxxxx"
}
```

Node.js
```js
const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:8080/image-classification'
const imagePath = './demo.jpg'
const outputImagePath = "./out.jpg";

let config = {
   method: 'POST',
   maxBodyLength: Infinity,
   url: API_URL,
   data: JSON.stringify({
    'image': encodeImageToBase64(imagePath)  // Base64编码的文件内容或者图像URL
  })
};

// 对本地图像进行Base64编码
function encodeImageToBase64(filePath) {
  const bitmap = fs.readFileSync(filePath);
  return Buffer.from(bitmap).toString('base64');
}

// 调用API
axios.request(config)
.then((response) => {
    // 处理接口返回数据
    const result = response.data["result"];
    const imageBuffer = Buffer.from(result["image"], 'base64');
    fs.writeFile(outputImagePath, imageBuffer, (err) => {
      if (err) throw err;
      console.log(\`Output image saved at ${outputImagePath}\`);
    });
    console.log("\nCategories:");
    console.log(result["categories"]);
})
.catch((error) => {
  console.log(error);
});
```
