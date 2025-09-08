
[官方文档](https://help.aliyun.com/)

可通过 DashScope SDK 或 HTTP 请求方式，将阿里云百炼的智能体应用集成至业务系统。

## 快速开始

Python

Java

HTTP

curl

PHP

Node.js

C#

Go

**需安装相关依赖：**

```sh
npm install axios
```

**请求示例**

**响应示例**

```json
我是来自阿里云的大规模语言模型，我叫通义千问。
```

## 核心功能

### 多轮对话

相比于单轮对话，多轮对话可以让大模型参考历史对话信息，更符合日常交流的场景。

<table><tbody><tr><td rowspan="1" colspan="1"><p><b>云端存储</b></p></td><td rowspan="1" colspan="1"><p><b>自行管理</b></p></td></tr><tr><td rowspan="1" colspan="1"><p>通过传入 <code>session_id</code> ，系统会自动从云端加载存储的对话历史，并结合新的指令生成上下文。</p></td><td rowspan="1" colspan="1"><p>需要维护一个 <code>messages</code> 数组，手动记录和传递每一轮的对话历史及新指令。</p></td></tr><tr><td rowspan="1" colspan="1"><p>必传参数</p><ul><li><p><code>session_id</code> ：会话ID。</p></li><li><p><code>prompt</code> ：提示词。</p></li></ul></td><td rowspan="1" colspan="1"><p>必传参数： <code>messages</code> 数组</p><p>可选参数： <code>prompt</code> （可选）</p><ul><li><p>若传入 <code>prompt</code> ， <code>prompt</code> 会被转换为一条 <code>{"role": "user", "content": "prompt"}</code> ，自动追加到 <code>messages</code> 末尾，生成最终上下文。</p></li><li><p>示例：</p><div><pre><code>// 原始传入
{
  "messages": [{"role": "user", "content": "你好"}], 
  "prompt": "推荐一部电影"
}
// 实际生效的messages
[
  {"role": "user", "content": "你好"}, 
  {"role": "user", "content": "推荐一部电影"}
]</code></pre></div></li></ul></td></tr><tr><td rowspan="1" colspan="2"><p><b>优先级规则：</b> 若同时传入 <code>session_id</code> &nbsp;和&nbsp; <code>messages</code> ，则优先使用&nbsp; <code>messages</code> ，忽略&nbsp; <code>session_id</code> 。</p></td></tr></tbody></table>

云端存储

自行管理

Python

Java

HTTP

curl

PHP

Node.js

C#

Go

**需安装相关依赖：**

```sh
npm install axios
```

**请求示例**

```javascript
const axios = require('axios');
async function callDashScope() {
    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID';//替换为实际的应用 ID

    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        "input": {
        "messages":[      
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "你是谁？"
            },
            {
                "role": "assistant",
                "content": "我是阿里云开发的大规模语言模型，我叫通义千问。"
            },
            {
                "role": "user",
                "content": "你能做什么？"
            }
        ]
    },
        parameters: {},
        debug: {}
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log(\`${response.data.output.text}\`);
        } else {
            console.log(\`request_id=${response.headers['request_id']}\`);
            console.log(\`code=${response.status}\`);
            console.log(\`message=${response.data.message}\`);
        }
    } catch (error) {
        console.error(\`Error calling DashScope: ${error.message}\`);
        if (error.response) {
            console.error(\`Response status: ${error.response.status}\`);
            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
        }
    }
}

callDashScope();
```

**响应示例**

```json
可以帮助你完成多种任务，包括但不限于：

1. 回答问题：无论是学术知识、实用信息还是常识性问题，我都会尽力提供准确的答案。
2. 创作文字：比如写故事、写公文、写邮件、写剧本等，只要你给出足够的背景信息和要求，我就能帮你撰写。
3. 提供建议：如果你需要在某些决策上得到建议，比如旅行目的地选择、礼物挑选、学习方法等，我也可以根据你的描述提供建议。
4. 语言翻译：支持多国语言之间的文本翻译。
5. 代码编写与解释：对于编程相关的问题，我可以帮助编写简单的程序或解释复杂的概念。
6. 进行对话：除了上述功能外，我还能够与用户进行日常交流，分享想法。

如果你有任何具体的需求，请随时告诉我！
```

### 流式输出

**调用示例**

如果智能体应用内使用了 [深度思考模型](https://help.aliyun.com/zh/model-studio/deep-thinking#5be853b164zv4) （例如 Qwen3），输出顺序为“先思考、后答案”。调用时设置 `has_thoughts` 参数为 `True` ，即可在 `thoughts` 字段中返回思考过程。

- 其中 **Qwen3模型** 开启思考模式有两种方式：一是在应用内打开 **思考模式** 开关并 **发布** 应用；二是API调用时设置 `enable_thinking`  为  `true` 。若同时设置，则以API参数为准。
- 其他思考模型默认开启思考模式，且无法关闭。

Python

Java

HTTP

curl

PHP

Node.js

C#

Go

**需安装相关依赖：**

```sh
npm install axios
```

**请求示例**

**1.输出完整响应**

```javascript
const axios = require('axios');

async function callDashScope() {
    //若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID';// 替换为实际的应用 ID

    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        input: {
            prompt: "你是谁？"
        },
        parameters: {
            'incremental_output' : 'true' // 增量输出
        },
        debug: {}
    };

    try {
        console.log("Sending request to DashScope API...");

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json',
                'X-DashScope-SSE': 'enable' // 流式输出
            },
            responseType: 'stream' // 用于处理流式响应
        });

        if (response.status === 200) {
            // 处理流式响应
            response.data.on('data', (chunk) => {
                console.log(\`Received chunk: ${chunk.toString()}\`);
            });
        } else {
            console.log("Request failed:");
            if (response.data.request_id) {
                console.log(\`request_id=${response.data.request_id}\`);
            }
            console.log(\`code=${response.status}\`);
            if (response.data.message) {
                console.log(\`message=${response.data.message}\`);
            } else {
                console.log('message=Unknown error');
            }
        }
    } catch (error) {
        console.error(\`Error calling DashScope: ${error.message}\`);
        if (error.response) {
            console.error(\`Response status: ${error.response.status}\`);
            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
        }
    }
}

callDashScope();
```

可展开折叠面板查看具体内容：

**2.只输出text字段内容**

```javascript
const axios = require('axios');
const { Transform } = require('stream');

async function callDashScope() {
    //若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID'; // 替换为实际的应用 ID

    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        input: { prompt: "你是谁？" },
        parameters: { incremental_output: true }, // 增量输出
        debug: {}
    };

    try {
        console.log("Sending request to DashScope API...");

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json',
                'X-DashScope-SSE': 'enable' // 流式输出
            },
            responseType: 'stream' // 用于处理流式响应
        });

        if (response.status === 200) {
            // // 处理流式响应 SSE协议解析转换流
            const sseTransformer = new Transform({
                transform(chunk, encoding, callback) {
                    this.buffer += chunk.toString();
                    
                    // 按SSE事件分割（两个换行符）
                    const events = this.buffer.split(/\n\n/);
                    this.buffer = events.pop() || ''; // 保留未完成部分
                    
                    events.forEach(eventData => {
                        const lines = eventData.split('\n');
                        let textContent = '';
                        
                        // 解析事件内容
                        lines.forEach(line => {
                            if (line.startsWith('data:')) {
                                try {
                                    const jsonData = JSON.parse(line.slice(5).trim());
                                    if (jsonData.output?.text) {
                                        textContent = jsonData.output.text;
                                    }
                                } catch(e) {
                                    console.error('JSON解析错误:', e.message);
                                }
                            }
                        });

                        if (textContent) {
                            // 添加换行符并推送
                            this.push(textContent + '\n');
                        }
                    });
                    
                    callback();
                },
                flush(callback) {
                    if (this.buffer) {
                        this.push(this.buffer + '\n');
                    }
                    callback();
                }
            });
            sseTransformer.buffer = '';

            // 管道处理
            response.data
                .pipe(sseTransformer)
                .on('data', (textWithNewline) => {
                    process.stdout.write(textWithNewline); // 自动换行输出
                })
                .on('end', () => console.log(""))
                .on('error', err => console.error("管道错误:", err));

        } else {
            console.log("请求失败，状态码:", response.status);
            response.data.on('data', chunk => console.log(chunk.toString()));
        }
    } catch (error) {
        console.error(\`API调用失败: ${error.message}\`);
        if (error.response) {
            console.error(\`状态码: ${error.response.status}\`);
            error.response.data.on('data', chunk => console.log(chunk.toString()));
        }
    }
}

callDashScope();
```

**响应示例**

1.输出完整响应

2.只输出text字段内容

```json
id:1
event:result
:HTTP_STATUS/200
data:{"output":{"session_id":"bb9fb75687104983ae47fc1f34ef36a1","finish_reason":"null","text":"你好！"},"usage":{"models":[{"input_tokens":56,"output_tokens":2,"model_id":"qwen-max"}]},"request_id":"d96ec7e0-5ad8-9f19-82c1-9c87f86e12b8"}
id:2
event:result
:HTTP_STATUS/200
data:{"output":{"session_id":"bb9fb75687104983ae47fc1f34ef36a1","finish_reason":"null","text":"有什么"},"usage":{"models":[{"input_tokens":56,"output_tokens":3,"model_id":"qwen-max"}]},"request_id":"d96ec7e0-5ad8-9f19-82c1-9c87f86e12b8"}
id:3
event:result
:HTTP_STATUS/200
data:{"output":{"session_id":"bb9fb75687104983ae47fc1f34ef36a1","finish_reason":"null","text":"可以帮助"},"usage":{"models":[{"input_tokens":56,"output_tokens":4,"model_id":"qwen-max"}]},"request_id":"d96ec7e0-5ad8-9f19-82c1-9c87f86e12b8"}
id:4
event:result
:HTTP_STATUS/200
data:{"output":{"session_id":"bb9fb75687104983ae47fc1f34ef36a1","finish_reason":"null","text":"你的吗？"},"usage":{"models":[{"input_tokens":56,"output_tokens":7,"model_id":"qwen-max"}]},"request_id":"d96ec7e0-5ad8-9f19-82c1-9c87f86e12b8"}
id:5
event:result
:HTTP_STATUS/200
data:{"output":{"session_id":"bb9fb75687104983ae47fc1f34ef36a1","finish_reason":"stop","text":""},"usage":{"models":[{"input_tokens":56,"output_tokens":7,"model_id":"qwen-max"}]},"request_id":"d96ec7e0-5ad8-9f19-82c1-9c87f86e12b8"}
```

### 传递自定义参数

通过自定义提示词变量（引导输出方向）、插件参数（扩展能力）及用户级鉴权参数（权限控制），智能体可适配多种业务场景。调用时使用 `biz_params` 传递参数，实现灵活响应。

<table><tbody><tr><td rowspan="1" colspan="1"><p><b>描述</b></p></td><td rowspan="1" colspan="1"><p><b>说明</b></p></td></tr><tr><td rowspan="1" colspan="1"><p><code>user_prompt_params</code></p><p>类型： <code><i>object</i></code></p><p>传递自定义提示词变量。</p><p>用于传递在提示词中插入配置的变量。在控制台定义变量，API调用时传具体值。</p><p>示例：</p><p>prompt： <span>请给出{{city}}的三种美食推荐，只显示美食名称，逗号隔开。</span></p><p>参数：</p><div><pre><code>biz_params = {
    "user_prompt_params":{
        "city": "北京"}}</code></pre></div><p>实际生效prompt:<span>请给出北京的三种美食推荐，只显示美食名称，逗号隔开。</span></p></td><td rowspan="1" colspan="1"><p>控制台需要按如下步骤操作：</p><ol><li><p>在 <b>智能体应用</b> 内添加自定义变量；</p></li><li><p>在提示词中引用；</p></li><li><p><b>发布</b> 应用。</p></li></ol><p><strong>重要</strong></p><p>确保应用内添加的自定义变量名和API调用时传递的调用名一致。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>user_defined_params</code></p><p>类型： <code><i>object</i></code></p><p>传递自定义插件参数。</p><p>用于传递插件执行任务所需的业务数据（如城市、日期）。</p></td><td rowspan="2" colspan="1"><p>控制台需要按如下步骤操作：</p><ol><li><p>在控制台配置插件工具的业务透传参数；</p><p><strong>说明</strong></p><p>自定义插件工具参数的配置方法，请参考 <a href="https://help.aliyun.com/zh/model-studio/how-to-create-a-custom-plug-in">自定义插件</a> 。</p></li><li><p>测试并发布插件工具；</p></li><li><p>关联 <b>智能体应用</b> ，并 <b>发布</b> 应用。</p><p><strong>重要</strong></p><p>插件工具只能与位于相同业务空间里的 <b>智能体应用</b> 关联。</p></li></ol></td></tr><tr><td rowspan="1" colspan="1"><p>user_defined_tokens</p><p>类型： <code><i>object</i></code></p><p>传递自定义插件用户级鉴权参数。</p><p>插件调用时的用户身份验证（如 <code>DASHSCOPE_API_KEY</code> ）。</p><div><pre><code>biz_params = {
    "user_defined_params": {
        "&lt;YOUR_TOOL_ID&gt;": {
            "city": "北京"}},
    "user_defined_tokens": {
        "&lt;YOUR_TOOL_ID&gt;": {
            "user_token": "sk-xxx"}}}</code></pre></div></td></tr></tbody></table>

API调用示例如下：

提示词变量

插件业务参数

插件用户级鉴权参数

**使用步骤**

1. 在控制台的 **智能体应用** 内添加自定义变量，并在提示词中引用，然后 **发布** 应用。示例：
	![image](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/9864148471/p960772.png)
2. API调用，示例如下：
	Python
	Java
	HTTP
	curl
	PHP
	Node.js
	C#
	Go
	**需安装相关依赖：**
	```sh
	npm install axios
	```
	**请求示例**
	```javascript
	const axios = require('axios');
	async function callDashScope() {
	    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	    const apiKey = process.env.DASHSCOPE_API_KEY;
	    const appId = 'YOUR_APP_ID';// 替换为实际的应用 ID
	    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;
	    // user_prompt_params可传递多个自定义变量键值对，英文逗号隔开。
	    const data = {
	        input: {
	            prompt: "美食推荐",
	            biz_params: {
	                user_prompt_params: {      
	                    'city': '北京'  
	                }
	            }
	        },
	        parameters: {},
	        debug: {}
	    };
	    try {
	        console.log("Sending request to DashScope API...");
	        const response = await axios.post(url, data, {
	            headers: {
	                'Authorization': \`Bearer ${apiKey}\`,
	                'Content-Type': 'application/json'
	            }
	        });
	        if (response.status === 200) {
	            if (response.data.output && response.data.output.text) {
	                console.log(\`${response.data.output.text}\`);
	            }
	        } else {
	            console.log("Request failed:");
	            if (response.data.request_id) {
	                console.log(\`request_id=${response.data.request_id}\`);
	            }
	            console.log(\`code=${response.status}\`);
	            if (response.data.message) {
	                console.log(\`message=${response.data.message}\`);
	            } else {
	                console.log('message=Unknown error');
	            }
	        }
	    } catch (error) {
	        console.error(\`Error calling DashScope: ${error.message}\`);
	        if (error.response) {
	            console.error(\`Response status: ${error.response.status}\`);
	            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
	        }
	    }
	}
	callDashScope();
	```
	**响应示例**
	```json
	北京烤鸭，炸酱面，豆汁儿
	```

以 [应用的参数传递](https://help.aliyun.com/zh/model-studio/pass-through-of-application-parameters) 中的 **寝室公约内容查询工具** 作为示例 ，通过传递关联插件的“索引”（article\_index参数），查询寝室公约内容。

> `<YOUR_TOOL_ID>` 替换为关联的插件工具ID（可在插件卡片中获取），并传递插件中配置的输入参数键值对。本示例中传递的参数为article\_index，值为2。

Python

Java

HTTP

**请求示例**

```python
import os
from http import HTTPStatus
# 建议dashscope SDK 的版本 >= 1.14.0
from dashscope import Application
biz_params = {
    # 智能体应用的自定义插件输入参数传递，自定义的插件ID替换<YOUR_TOOL_ID>
    "user_defined_params": {
        "<YOUR_TOOL_ID>": {
            "article_index": 2}}}
response = Application.call(
        # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        app_id='YOUR_APP_ID',
        prompt='寝室公约内容',
        biz_params=biz_params)

if response.status_code != HTTPStatus.OK:
    print(f'request_id={response.request_id}')
    print(f'code={response.status_code}')
    print(f'message={response.message}')
    print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
else:
    print('%s\n' % (response.output.text))  # 处理只输出文本text
    # print('%s\n' % (response.usage))
```

**响应示例**

```json
寝室公约的第二条规定如下：

"寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。"

这表明在寝室内，成员之间应该培养一种积极正面的生活和学习氛围，彼此帮助和支持，同时也要学会理解和尊重他人。如果您需要了解公约的其他条款，请告诉我！
```

**请求示例**

```java
import com.alibaba.dashscope.app.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;

public class Main {
    public static void appCall() throws NoApiKeyException, InputRequiredException {
        String bizParams =
                // 智能体应用的自定义插件输入参数传递，自定义的插件ID替换<YOUR_TOOL_ID>
                "{\"user_defined_params\":{\"<YOUR_TOOL_ID>\":{\"article_index\":2}}}";
        ApplicationParam param = ApplicationParam.builder()
                // 若没有配置环境变量，可用百炼API Key将下行替换为：.apiKey("sk-xxx")。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .appId("YOUR_APP_ID")
                .prompt("寝室公约内容")
                .bizParams(JsonUtils.parse(bizParams))
                .build();

        Application application = new Application();
        ApplicationResult result = application.call(param);
        System.out.printf("%s\n",
                result.getOutput().getText());
    }

    public static void main(String[] args) {
        try {
            appCall();
        } catch (ApiException | NoApiKeyException | InputRequiredException e) {
            System.out.printf("Exception: %s", e.getMessage());
            System.out.println("请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code");
        }
        System.exit(0);
    }
}
```

**响应示例**

```json
寝室公约的第二条规定如下：

第二条 寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。

这强调了在共同生活环境中，室友之间应该保持积极正面的关系，通过相互帮助和支持来营造一个和谐的生活和学习氛围。如果有更多具体的条款需要了解，请告知我。
```

curl

PHP

Node.js

C#

Go

**请求示例**

> YOUR\_APP\_ID替换为实际的应用 ID。<YOUR\_TOOL\_ID>替换为插件ID。

**响应示例**

```json
{"output":
{"finish_reason":"stop",
"session_id":"e151267ffded4fbdb13d91439011d31e",
"text":"寝室公约的第二条内容是：“寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。”这意呀着在寝室生活中，大家要彼此支持，共同创造一个和谐、积极向上的生活环境。"},
"usage":{"models":[{"output_tokens":94,"model_id":"qwen-max","input_tokens":453}]},
"request_id":"a39fd2b5-7e2c-983e-84a1-1039f726f18a"}%
```

**请求示例**

```php
<?php

# 若没有配置环境变量，可用百炼API Key将下行替换为：$api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
$api_key = getenv("DASHSCOPE_API_KEY");
$application_id = 'YOUR_APP_ID'; // 替换为实际的应用 ID
$url = "https://dashscope.aliyuncs.com/api/v1/apps/$application_id/completion";
//<YOUR_TOOL_ID>替换为实际的插件ID
// 构造请求数据
$data = [
    "input" => [
        'prompt' => '寝室公约内容',
        'biz_params' => [
        'user_defined_params' => [
            '<YOUR_TOOL_ID>' => [
                'article_index' => 2            
                ]
            ]
        ]
    ],
];
// 将数据编码为 JSON
$dataString = json_encode($data);

// 检查 json_encode 是否成功
if (json_last_error() !== JSON_ERROR_NONE) {
    die("JSON encoding failed with error: " . json_last_error_msg());
}

// 初始化 cURL 对话
$ch = curl_init($url);

// 设置 cURL 选项
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);

// 执行请求
$response = curl_exec($ch);

// 检查 cURL 执行是否成功
if ($response === false) {
    die("cURL Error: " . curl_error($ch));
}

// 获取 HTTP 状态码
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
// 关闭 cURL 对话
curl_close($ch);
// 解码响应数据
$response_data = json_decode($response, true);
// 处理响应
if ($status_code == 200) {
    if (isset($response_data['output']['text'])) {
        echo "{$response_data['output']['text']}\n";
    } else {
        echo "No text in response.\n";
    }
}else {
    if (isset($response_data['request_id'])) {
        echo "request_id={$response_data['request_id']}\n";}
    echo "code={$status_code}\n";
    if (isset($response_data['message'])) {
        echo "message={$response_data['message']}\n";} 
    else {
        echo "message=Unknown error\n";}
}
?>
```

**响应示例**

```json
寝室公约的第二条规定：寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。这是为了保证大家能在一个和谐友爱的环境中生活和学习。如果有更多具体的条款需要了解，或者有其他问题，随时可以问我！
```

**需安装相关依赖：**

```sh
npm install axios
```

**请求示例**

```javascript
const axios = require('axios');

async function callDashScope() {
    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID';// 替换为实际的应用 ID
    const pluginCode = 'YOUR_TOOL_ID';// 替换为实际的插件ID
    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        input: {
            prompt: "寝室公约内容",
            biz_params: {
                user_defined_params: {
                    [pluginCode]: {
                        // article_index为自定义插件的变量，替换为实际的插件变量
                        'article_index': 3
                    }
                }
            }
        },
        parameters: {},
        debug: {}
    };

    try {
        console.log("Sending request to DashScope API...");

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (response.data.output && response.data.output.text) {
                console.log(\`${response.data.output.text}\`);
            }
        } else {
            console.log("Request failed:");
            if (response.data.request_id) {
                console.log(\`request_id=${response.data.request_id}\`);
            }
            console.log(\`code=${response.status}\`);
            if (response.data.message) {
                console.log(\`message=${response.data.message}\`);
            } else {
                console.log('message=Unknown error');
            }
        }
    } catch (error) {
        console.error(\`Error calling DashScope: ${error.message}\`);
        if (error.response) {
            console.error(\`Response status: ${error.response.status}\`);
            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
        }
    }
}
callDashScope();
```

**响应示例**

```json
寝室公约的第三条规定如下：

注意安全用电，杜绝火灾隐患。寝室内严禁使用明火、违规电器、各种灶具以及其他违规物品，不得存放易爆、易燃物品，私接电源。

如果您需要了解更多的规定，请告诉我。
```

**请求示例**

```csharp
using System.Text;

class Program
{
    static async Task Main(string[] args)
    {
        // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
        string apiKey = Environment.GetEnvironmentVariable("DASHSCOPE_API_KEY")?? throw new InvalidOperationException("DASHSCOPE_API_KEY environment variable is not set.");;
        string appId = "YOUR_APP_ID";// 替换为实际的应用ID

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine("请确保设置了 DASHSCOPE_API_KEY。");
            return;
        }

        string url = $"https://dashscope.aliyuncs.com/api/v1/apps/{appId}/completion";

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            string pluginCode = "YOUR_TOOL_ID"; // YOUR_TOOL_ID替换为实际的插件 ID
            string jsonContent = $@"{{
                ""input"": {{
                    ""prompt"": ""寝室公约内容"",
                    ""biz_params"": {{
                        ""user_defined_params"": {{
                            ""{pluginCode}"": {{
                                ""article_index"": 2
                            }}
                        }}
                    }}
                }},
                ""parameters"": {{}},
                ""debug"": {{}}
            }}";

            HttpContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            try
            {
                HttpResponseMessage response = await client.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Request successful:");
                    Console.WriteLine(responseBody);
                }
                else
                {
                    Console.WriteLine($"Request failed with status code: {response.StatusCode}");
                    string responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(responseBody);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling DashScope: {ex.Message}");
            }
        }
    }
}
```

**响应示例**

```json
{
    "output": {
        "finish_reason": "stop",
        "session_id": "237ca6187c814f3b9e7461090a5f8b74",
        "text": "寝室公约的第二条规定如下：

"寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。"

这表示在寝室内，成员之间需要建立起一种积极正面的关系，通过帮助、关心和支持彼此来营造一个和谐的生活和学习环境。同时也要学会理解和接受室友之间的差异，以真诚的态度去交流沟通。如果还有其他条款或具体内容想要了解，请告诉我！"
    },
    "usage": {
        "models": [
            {
                "output_tokens": 133,
                "model_id": "qwen-max",
                "input_tokens": 829
            }
        ]
    },
    "request_id": "64e8c359-d071-9d2e-bb94-187e86cc3a79"
}
```

**请求示例**

```json
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey := "sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    apiKey := os.Getenv("DASHSCOPE_API_KEY")
    appId := "YOUR_APP_ID"           // 替换为实际的应用 ID
    pluginCode := "YOUR_TOOL_ID" // 替换为实际的插件 ID

    if apiKey == "" {
        fmt.Println("请确保设置了DASHSCOPE_API_KEY。")
        return
    }

    url := fmt.Sprintf("https://dashscope.aliyuncs.com/api/v1/apps/%s/completion", appId)

    // 创建请求体
    requestBody := map[string]interface{}{
        "input": map[string]interface{}{
            "prompt": "寝室公约内容",
            "biz_params": map[string]interface{}{
                "user_defined_params": map[string]interface{}{
                    pluginCode: map[string]interface{}{
                        "article_index": 2,
                    },
                },
            },
        },
        "parameters": map[string]interface{}{},
        "debug":      map[string]interface{}{},
    }

    jsonData, err := json.Marshal(requestBody)
    if err != nil {
        fmt.Printf("Failed to marshal JSON: %v\n", err)
        return
    }

    // 创建 HTTP POST 请求
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        fmt.Printf("Failed to create request: %v\n", err)
        return
    }

    // 设置请求头
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", "application/json")

    // 发送请求
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("Failed to send request: %v\n", err)
        return
    }
    defer resp.Body.Close()

    // 读取响应
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Printf("Failed to read response: %v\n", err)
        return
    }

    // 处理响应
    if resp.StatusCode == http.StatusOK {
        fmt.Println("Request successful:")
        fmt.Println(string(body))
    } else {
        fmt.Printf("Request failed with status code: %d\n", resp.StatusCode)
        fmt.Println(string(body))
    }
}
```

**响应示例**

```json
{
    "output": {
        "finish_reason": "stop",
        "session_id": "860d2a4c1f3649ac880298537993cb51",
        "text": "寝室公约的第二条规定如下：

寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。

这强调了在宿舍生活中，室友之间应该保持良好的互助关系，同时也要互相尊重对方。您想要了解其他条款的内容吗？"
    },
    "usage": {
        "models": [
            {
                "output_tokens": 84,
                "model_id": "qwen-max",
                "input_tokens": 876
            }
        ]
    },
    "request_id": "0a250055-90a4-992d-9276-e268ad35d1ab"
}
```

以 [应用的参数传递](https://help.aliyun.com/zh/model-studio/pass-through-of-application-parameters) 中的 **寝室公约内容查询工具** 作为示例 ，通过传递关联插件的“索引”（article\_index参数）和用户级鉴权信息，查询寝室公约内容。

> `<YOUR_TOOL_ID>` 替换为关联的插件工具ID（可在插件卡片中获取），并传递插件中配置的输入参数键值对。本示例中传递的参数为article\_index，值为2。

Python

Java

HTTP

**请求示例**

```python
from http import HTTPStatus
import os
# 建议dashscope SDK 的版本 >= 1.14.0
from dashscope import Application
biz_params = {
    # 智能体应用的自定义插件鉴权传递，自定义的插件ID替换<YOUR_TOOL_ID>，鉴权信息替换YOUR_TOKEN，如API key
    "user_defined_params": {
        "<YOUR_TOOL_ID>": {
            "article_index": 2}},
    "user_defined_tokens": {
        "<YOUR_TOOL_ID>": {
            "user_token": "YOUR_TOKEN"}}}
response = Application.call(
            # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
            api_key=os.getenv("DASHSCOPE_API_KEY"), 
            app_id='YOUR_APP_ID',
            prompt='寝室公约内容',
            biz_params=biz_params)

if response.status_code != HTTPStatus.OK:
    print(f'request_id={response.request_id}')
    print(f'code={response.status_code}')
    print(f'message={response.message}')
    print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
else:
    print('%s\n' % (response.output.text))  # 处理只输出文本text
    # print('%s\n' % (response.usage))
```

**响应示例**

```json
寝室公约的第二条规定如下：

寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。

如果您需要了解更多的规定内容，请告诉我。
```

**请求示例**

```java
import com.alibaba.dashscope.app.*;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.utils.JsonUtils;

public class Main {
    public static void appCall() throws NoApiKeyException, InputRequiredException {
        String bizParams =
                // <YOUR_TOOL_ID>替换为实际的插件ID,YOUR_TOKEN替换为实际的Token,如API key
                "{\"user_defined_params\":{\"<YOUR_TOOL_ID>\":{\"article_index\":2}}," +
                        "\"user_defined_tokens\":{\"<YOUR_TOOL_ID>\":{\"user_token\":\"YOUR_TOKEN\"}}}";
        ApplicationParam param = ApplicationParam.builder()
                // 若没有配置环境变量，可用百炼API Key将下行替换为：.apiKey("sk-xxx")。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .appId("YOUR_APP_ID")
                .prompt("寝室公约内容")
                .bizParams(JsonUtils.parse(bizParams))
                .build();

        Application application = new Application();
        ApplicationResult result = application.call(param);
        System.out.printf("%s\n",
                result.getOutput().getText());
    }
    public static void main(String[] args) {
        try {
            appCall();
        } catch (ApiException | NoApiKeyException | InputRequiredException e) {
            System.out.printf("Exception: %s", e.getMessage());
            System.out.println("请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code");
        }
        System.exit(0);
    }
}
```

**响应示例**

```json
寝室公约的第二条规定如下：

寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。

如果您需要查询更多的规定内容，请告诉我。
```

curl

PHP

Node.js

C#

Go

**请求示例**

> YOUR\_APP\_ID替换为实际的应用 ID。<YOUR\_TOOL\_ID>替换为实际的插件ID。

**响应示例**

```json
{"output":{"finish_reason":"stop",
"session_id":"d3b5c3e269dc40479255a7a02df5c630",
"text":"寝室公约的第二条内容为：“寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。”这强调了寝室生活中成员之间和谐相处与共同进步的重要性。"},
"usage":{"models":[{"output_tokens":80,"model_id":"qwen-max","input_tokens":432}]},
"request_id":"1f77154c-edc3-9003-b622-816fa2f849cf"}%
```

**请求示例**

```php
<?php

# 若没有配置环境变量，可用百炼API Key将下行替换为：$api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
$api_key = getenv("DASHSCOPE_API_KEY");
$application_id = 'YOUR_APP_ID'; // 替换为实际的应用 ID
$url = "https://dashscope.aliyuncs.com/api/v1/apps/$application_id/completion";

// 构造请求数据
$data = [
    "input" => [
        'prompt' => '寝室公约内容',
        'biz_params' => [
        'user_defined_params' => [
            '<YOUR_TOOL_ID>' => [//<YOUR_TOOL_ID>替换为实际的插件ID
                'article_index' => 2            
                ]
            ],
        'user_defined_tokens' => [
            '<YOUR_TOOL_ID>' => [//<YOUR_TOOL_ID>替换为实际的插件ID
                'user_token' => 'YOUR_TOKEN'//替换为实际的Token,如API key
            ]
        ]
        ]
    ],
];
// 将数据编码为 JSON
$dataString = json_encode($data);

// 检查 json_encode 是否成功
if (json_last_error() !== JSON_ERROR_NONE) {
    die("JSON encoding failed with error: " . json_last_error_msg());
}

// 初始化 cURL 对话
$ch = curl_init($url);

// 设置 cURL 选项
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $api_key
]);

// 执行请求
$response = curl_exec($ch);

// 检查 cURL 执行是否成功
if ($response === false) {
    die("cURL Error: " . curl_error($ch));
}

// 获取 HTTP 状态码
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
// 关闭 cURL 对话
curl_close($ch);
// 解码响应数据
$response_data = json_decode($response, true);
// 处理响应
if ($status_code == 200) {
    if (isset($response_data['output']['text'])) {
        echo "{$response_data['output']['text']}\n";
    } else {
        echo "No text in response.\n";
    }
}else {
    if (isset($response_data['request_id'])) {
        echo "request_id={$response_data['request_id']}\n";}
    echo "code={$status_code}\n";
    if (isset($response_data['message'])) {
        echo "message={$response_data['message']}\n";} 
    else {
        echo "message=Unknown error\n";}
}
?>
```

**响应示例**

```json
寝室公约的第二条规定如下：

> 寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。

如果需要了解更多的公约内容或其他信息，请随时告诉我！
```

**需安装相关依赖：**

```sh
npm install axios
```

**请求示例**

```javascript
const axios = require('axios');
async function callDashScope() {
    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID';// 替换为实际的应用 ID
    const pluginCode = 'YOUR_TOOL_ID';// 替换为实际的插件ID
    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        input: {
            prompt: "寝室公约内容",
            biz_params: {
                user_defined_params: {
                    [pluginCode]: {
                        // article_index为自定义插件的变量，替换为实际的插件变量
                        'article_index': 6
                    }
                },
                user_defined_tokens: {
                    [pluginCode]: {
                        // YOUR_TOKEN替换为实际的鉴权信息,如API key
                        user_token: 'YOUR_TOKEN'
                    }
                }
            }
        },
        parameters: {},
        debug: {}
    };

    try {
        console.log("Sending request to DashScope API...");

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (response.data.output && response.data.output.text) {
                console.log(\`${response.data.output.text}\`);
            }
        } else {
            console.log("Request failed:");
            if (response.data.request_id) {
                console.log(\`request_id=${response.data.request_id}\`);
            }
            console.log(\`code=${response.status}\`);
            if (response.data.message) {
                console.log(\`message=${response.data.message}\`);
            } else {
                console.log('message=Unknown error');
            }
        }
    } catch (error) {
        console.error(\`Error calling DashScope: ${error.message}\`);
        if (error.response) {
            console.error(\`Response status: ${error.response.status}\`);
            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
        }
    }
}
callDashScope();
```

**响应示例**

```json
寝室公约的第六条规定：养成良好的作息习惯，每一位寝室成员都享有休息的权利和承担保证他人休息权利和义务。如果你需要了解更多的规定内容，请进一步说明。
```

**请求示例**

```csharp
using System.Text;

class Program
{
    static async Task Main(string[] args)
    {
        // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
        string apiKey = Environment.GetEnvironmentVariable("DASHSCOPE_API_KEY")?? throw new InvalidOperationException("DASHSCOPE_API_KEY environment variable is not set.");;
        string appId = "YOUR_APP_ID";// 替换为实际的应用ID

        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine("请确保设置了 DASHSCOPE_API_KEY。");
            return;
        }

        string url = $"https://dashscope.aliyuncs.com/api/v1/apps/{appId}/completion";

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            string pluginCode = "YOUR_TOOL_ID"; //替换为实际的插件 ID
            // YOUR_TOKEN替换为实际的Token,如API key
            string jsonContent = $@"{{
                ""input"": {{
                    ""prompt"": ""寝室公约内容"",
                    ""biz_params"": {{
                        ""user_defined_params"": {{
                            ""{pluginCode}"": {{
                                ""article_index"": 2
                            }}
                        }},
                        ""user_defined_tokens"": {{
                            ""{pluginCode}"": {{
                                ""user_token"": ""YOUR_TOKEN"" 
                            }}
                        }}
                    }}
                }},
                ""parameters"": {{}},
                ""debug"": {{}}
            }}";

            HttpContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            try
            {
                HttpResponseMessage response = await client.PostAsync(url, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("Request successful:");
                    Console.WriteLine(responseBody);
                }
                else
                {
                    Console.WriteLine($"Request failed with status code: {response.StatusCode}");
                    string responseBody = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(responseBody);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling DashScope: {ex.Message}");
            }
        }
    }
}
```

**响应示例**

```json
{
    "output": {
        "finish_reason": "stop",
        "session_id": "1a1913a9922a401f8eba36df8ea1a062",
        "text": "寝室公约的第二条规定如下：

寝室成员应当互帮互助、互相关心、互相学习、共同提高；宽容谦让、相互尊重、以诚相待。

如需了解更详细的公约内容，请进一步指明。"
    },
    "usage": {
        "models": [
            {
                "output_tokens": 66,
                "model_id": "qwen-max",
                "input_tokens": 802
            }
        ]
    },
    "request_id": "04bac806-c5e6-9fab-a846-a66641862be9"
}
```

**请求示例**

```json
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey := "sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    apiKey := os.Getenv("DASHSCOPE_API_KEY")
    appId := "YOUR_APP_ID"           // 替换为实际的应用 ID
    pluginCode := "YOUR_TOOL_ID" // 替换为实际的插件 ID

    if apiKey == "" {
        fmt.Println("请确保设置了DASHSCOPE_API_KEY。")
        return
    }

    url := fmt.Sprintf("https://dashscope.aliyuncs.com/api/v1/apps/%s/completion", appId)

    // 创建请求体
    requestBody := map[string]interface{}{
        "input": map[string]interface{}{
            "prompt": "寝室公约内容",
            "biz_params": map[string]interface{}{
                "user_defined_params": map[string]interface{}{
                    pluginCode: map[string]interface{}{
                        "article_index": 10,
                    },
                },
                "user_defined_tokens": map[string]interface{}{
                    pluginCode: map[string]interface{}{
                        "user_token": "YOUR_USER_TOKEN", // 替换实际的鉴权 token，如API key
                    },
                },
            },
        },
        "parameters": map[string]interface{}{},
        "debug":      map[string]interface{}{},
    }

    jsonData, err := json.Marshal(requestBody)
    if err != nil {
        fmt.Printf("Failed to marshal JSON: %v\n", err)
        return
    }

    // 创建 HTTP POST 请求
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        fmt.Printf("Failed to create request: %v\n", err)
        return
    }

    // 设置请求头
    req.Header.Set("Authorization", "Bearer "+apiKey)
    req.Header.Set("Content-Type", "application/json")

    // 发送请求
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Printf("Failed to send request: %v\n", err)
        return
    }
    defer resp.Body.Close()

    // 读取响应
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Printf("Failed to read response: %v\n", err)
        return
    }

    // 处理响应
    if resp.StatusCode == http.StatusOK {
        fmt.Println("Request successful:")
        fmt.Println(string(body))
    } else {
        fmt.Printf("Request failed with status code: %d\n", resp.StatusCode)
        fmt.Println(string(body))
    }
}
```

**响应示例**

```json
{
    "output": {
        "finish_reason": "stop",
        "session_id": "b8e051ba7e954ff8919208e7b84430fa",
        "text": "寝室公约的第十条规定，寝室成员应共同努力，营造和维护内务整洁干净、美观、高文化品味的寝室环境。如果需要了解完整的寝室公约内容，可能还需要查看其他条款或直接咨询宿舍管理部门。对于更多具体内容，您还有想要了解的部分吗？"
    },
    "usage": {
        "models": [
            {
                "output_tokens": 70,
                "model_id": "qwen-max",
                "input_tokens": 855
            }
        ]
    },
    "request_id": "0921ee34-2754-9616-a826-cea33a0e0a14"
}
```

## 进阶功能

### 检索知识库

知识库功能作为百炼的RAG能力，能有效地为大模型补充私有知识、提供最新信息。调用 **智能体应用** 时指定检索范围，可提高大模型的回答准确性。更多知识库功能请参考： [创建和使用知识库](https://help.aliyun.com/zh/model-studio/rag-knowledge-base) 。

#### 前提条件

在百炼控制台的 **智能体应用** 中，打开 **知识库** 开关，并 **发布** 应用。

#### 指定检索范围

1. 检索指定的 [创建和使用知识库](https://help.aliyun.com/zh/model-studio/rag-knowledge-base) ，有以下三种方式：
	1. 在应用内单击 **配置知识库** 以关联指定知识库，并 **发布** 应用；
	2. 在应用内不关联指定知识库，API调用时通过 `rag_options` 传入知识库ID；
	3. 既在应用内关联指定知识库，又在API调用时通过 `rag_options` 传入知识库ID。
		> 这种情况只会检索调用时传入的知识库。例如，网页端的 **智能体应用** 里关联了知识库A，而API调用时只指定了知识库B，那么不会检索知识库A，只会检索知识库B。
	获取知识库ID（ pipeline\_ids ）：可以在 **[知识库](https://bailian.console.alibabacloud.com/#/knowledge-base)** 页面获取，也可以使用 [CreateIndex](https://help.aliyun.com/zh/model-studio/api-bailian-2023-12-29-createindex) 接口（仅支持非结构化知识库）返回的 `Data.Id` 。
	可以是 **智能体应用** 已经关联的知识库，也可以是没有关联的知识库。
	调用示例：此处选择 [百炼系列手机产品介绍.docx](https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20240701/geijms/%E7%99%BE%E7%82%BC%E7%B3%BB%E5%88%97%E6%89%8B%E6%9C%BA%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D.docx) 作为一个非结构化数据知识库的文件。
	Python
	Java
	HTTP
	curl
	PHP
	Node.js
	C#
	Go
	**需安装相关依赖：**
	```sh
	npm install axios
	```
	**请求示例**
	```javascript
	const axios = require('axios');
	async function callDashScope() {
	    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	    const apiKey = process.env.DASHSCOPE_API_KEY;
	    const appId = 'YOUR_APP_ID';//替换为实际的应用 ID
	    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;
	    const data = {
	        input: {
	            prompt: "请帮我推荐一款3000元以下的手机"
	        },
	        parameters: {
	            rag_options:{
	                pipeline_ids:['YOUR_PIPELINE_ID1','YOUR_PIPELINE_ID2']  // 替换为指定的知识库ID，多个请用逗号隔开
	            }
	        },
	        debug: {}
	    };
	    try {
	        const response = await axios.post(url, data, {
	            headers: {
	                'Authorization': \`Bearer ${apiKey}\`,
	                'Content-Type': 'application/json'
	            }
	        });
	        if (response.status === 200) {
	            console.log(\`${response.data.output.text}\`);
	        } else {
	            console.log(\`request_id=${response.headers['request_id']}\`);
	            console.log(\`code=${response.status}\`);
	            console.log(\`message=${response.data.message}\`);
	        }
	    } catch (error) {
	        console.error(\`Error calling DashScope: ${error.message}\`);
	        if (error.response) {
	            console.error(\`Response status: ${error.response.status}\`);
	            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
	        }
	    }
	}
	callDashScope();
	```
	**响应示例**
	```json
	在3000元以下的预算内，我推荐您考虑**百炼 Zephyr Z9**。这款手机参考售价为3999-4299元，但如果能赶上促销活动或折扣，可能会降到您的预算范围内。
	### 百炼 Zephyr Z9 ——轻薄便携的艺术
	- **屏幕**: 6.4英寸 1080 x 2340像素
	- **存储与RAM**: 128GB存储 / 6GB RAM
	- **电池**: 4000mAh
	- **相机**: 30倍数字变焦镜头
	这款手机的特点是轻薄便携，日常使用非常方便，而且具有不错的续航能力。如果您更关注性价比和日常使用体验，百炼 Zephyr Z9 是一个不错的选择。
	如果您的预算非常严格，建议关注电商平台的促销活动，或者考虑其他品牌的同价位手机。希望这些建议对您有所帮助！
	```
2. 检索指定的 **非结构化数据** 文档：在 `rag_options` 中传入知识库ID、文档ID、文档标签tags或文档元数据metadata（键值对）。
	> 文档ID、文档标签tags和文档元数据metadata仅对 **非结构化数据** 文档检索生效。
	- 获取方式：
		- 文档ID（ file\_ids ）：可以在 [应用数据](https://bailian.console.aliyun.com/#/data-center) 页面的文档列表中获取，也可以使用 [AddFile](https://help.aliyun.com/zh/model-studio/api-bailian-2023-12-29-addfile) 接口导入文档返回的ID 。
		- 文档标签（tags）：可以在 [应用数据](https://bailian.console.aliyun.com/#/data-center) 页面查看非结构化文档的标签。也可以通过 [DescribeFile](https://help.aliyun.com/zh/model-studio/api-bailian-2023-12-29-describefile) 接口获取。
		- 文档元数据（metadata）：在 [知识库](https://bailian.console.aliyun.com/#/knowledge-base) 页面，进入某个知识库后可以查看非结构化文档的元数据（ **Meta信息** ）。
	- 可以传入多个文档ID，仅支持已建立知识索引的文档。
	- 传入文档ID时，需要同时传入文档所属的知识库ID，检索才会生效 。
	- 只会在指定的文档里检索。例如：网页端的 **智能体应用** 里引用了知识库A，而API调用时指定了文档ID和其所属的知识库B的ID，那么不会检索知识库A的文档，只会检索知识库B的文档 ***。***
		此处示例选择 [百炼系列手机产品介绍.docx](https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20240701/geijms/%E7%99%BE%E7%82%BC%E7%B3%BB%E5%88%97%E6%89%8B%E6%9C%BA%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D.docx) 作为非结构化数据知识库文件。
		Python
		Java
		HTTP
		curl
		PHP
		Node.js
		C#
		Go
		**需安装相关依赖：**
		```sh
		npm install axios
		```
		**请求示例**
		```javascript
		const axios = require('axios');
		async function callDashScope() {
		    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
		    const apiKey = process.env.DASHSCOPE_API_KEY;
		    const appId = 'YOUR_APP_ID';//替换为实际的应用 ID
		    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;
		    const data = {
		        input: {
		            prompt: "请帮我推荐一款3000元以下的手机"
		        },
		        parameters: {
		            rag_options:{
		                pipeline_ids:['YOUR_PIPELINE_ID1','YOUR_PIPELINE_ID2'], // 替换为指定的知识库ID，多个请用逗号隔开
		                file_ids:['YOUR_FILE_ID1','YOUR_FILE_ID2'], // 替换为指定的文件 ID，多个请用逗号隔开
		                metadata_filter:{ // 元数据键值对，多个请用逗号隔开
		                    'key1':'value1',
		                    'key2':'value2'
		                },
		                tags: ['标签1', '标签2'] // 文档标签，多个请用逗号隔开
		            }
		        },
		        debug: {}
		    };
		    try {
		        const response = await axios.post(url, data, {
		            headers: {
		                'Authorization': \`Bearer ${apiKey}\`,
		                'Content-Type': 'application/json'
		            }
		        });
		        if (response.status === 200) {
		            console.log(\`${response.data.output.text}\`);
		        } else {
		            console.log(\`request_id=${response.headers['request_id']}\`);
		            console.log(\`code=${response.status}\`);
		            console.log(\`message=${response.data.message}\`);
		        }
		    } catch (error) {
		        console.error(\`Error calling DashScope: ${error.message}\`);
		        if (error.response) {
		            console.error(\`Response status: ${error.response.status}\`);
		            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
		        }
		    }
		}
		callDashScope();
		```
		**响应示例**
		```json
		在3000元以下的预算范围内，我推荐您考虑**百炼 Zephyr Z9**。这款手机的价格区间是2499-2799元，它拥有轻薄便携的设计，配备6.4英寸1080 x 2340像素屏幕、128GB存储与6GB RAM，能够满足日常使用需求。其4000mAh电池保证了一天的使用时间，而30倍数字变焦镜头则可以帮助捕捉到更远距离的细节。总体来说，这是一款性价比较高的选择。
		```
3. 检索 **结构化数据** 文档里的指定数据：在 `rag_options` 中传入知识库ID、结构化数据文档的“结构化数据表头+值”的键值对。
	获取结构化数据键值对（ structured\_filter）： 在 [知识库](https://bailian.console.aliyun.com/#/knowledge-base) 页面，进入某个知识库后可以单击 **查看索引** 查看结构化文档的索引信息。
	Python
	Java
	HTTP
	curl
	PHP
	Node.js
	C#
	Go
	**需安装相关依赖：**
	```sh
	npm install axios
	```
	**请求示例**
	```javascript
	const axios = require('axios');
	async function callDashScope() {
	    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	    const apiKey = process.env.DASHSCOPE_API_KEY;
	    const appId = 'YOUR_APP_ID';  // 替换为实际的应用 ID
	    // YOUR_PIPELINE_ID1替换为指定的知识库ID, 多个知识库ID之间用逗号隔开
	    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;
	    const data = {
	        input: {
	            prompt: "请帮我推荐一款3000元以下的手机"
	        },
	        parameters: {
	            rag_options:{
	                pipeline_ids:['YOUR_PIPELINE_ID1','YOUR_PIPELINE_ID2'],
	                structured_filter:{
	                    'key1':'value1',
	                    'key2':'value2'
	                }
	            }
	        },
	        debug: {}
	    };
	    try {
	        const response = await axios.post(url, data, {
	            headers: {
	                'Authorization': \`Bearer ${apiKey}\`,
	                'Content-Type': 'application/json'
	            }
	        });
	        if (response.status === 200) {
	            console.log(\`${response.data.output.text}\`);
	        } else {
	            console.log(\`request_id=${response.headers['request_id']}\`);
	            console.log(\`code=${response.status}\`);
	            console.log(\`message=${response.data.message}\`);
	        }
	    } catch (error) {
	        console.error(\`Error calling DashScope: ${error.message}\`);
	        if (error.response) {
	            console.error(\`Response status: ${error.response.status}\`);
	            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
	        }
	    }
	}
	callDashScope();
	```
	**响应示例**
	```json
	我为您推荐"百炼"这款手机，它的价格是2999元，符合您的预算要求。如果您需要了解更多详情或有其他特定需求，请告诉我！
	```

#### 查看信息

- **查看检索过程信息：** 调用时在代码中添加 `has_thoughts` 并设置为True，则检索的过程信息会在 `output` 的 `thoughts` 字段中返回。
- **查看回答来源信息：** 单击 **知识库** 开关旁的 **配置** ，在页面中打开 **展示回答来源** 开关，然后 **发布** 应用，可在调用的返回结果中查看回答来源。
	![image](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/2935773571/p949493.png)

### 深度思考

如果您在 **智能体应用** 内选择了 [深度思考模型](https://help.aliyun.com/zh/model-studio/deep-thinking#5be853b164zv4) ，并成功 **发布** 应用，则：

**开启思考模式** ：

要开启思考模式并接收其输出，您可通过以下两种方式进行相应设置。

1. **控制台设置**
	**对于 Qwen3 模型** ：在控制台应用内，确保 **思考模式** 开关已打开，然后重新 **发布** 应用。
	**对于其他模型** ：默认开启思考模式，无需额外操作。
2. **API 调用参数设置**
	**对于 Qwen3 模型** ：将enable\_thinking参数设置为 true。
	对于其他模型：enable\_thinking参数无效。

**重要**

优先级：若两种方式同时设置，则以API参数为准。

**获取思考过程：**

- 将has\_thoughts参数设置为 true。

**处理返回结果** ：

- **思考过程** ：将在响应的 `thought` 字段中返回。
- **最终回复** ：将在响应的 `text` 字段中返回。

深度思考模型可能会输出较长的思考过程，为了降低超时风险，建议您使用流式输出方式调用应用，参考下方示例。

Python

Java

curl

- YOUR\_APP\_ID替换为实际的应用ID。
- 如需直接传入 API Key，请将$DASHSCOPE\_API\_KEY 替换为您的 API Key。
- 请指定Header中的 **X-DashScope-SSE** 为 **enable，** 表示流式输出回复。
- 请在 `parameters` 对象中添加 `has_thoughts` 参数，表示是否返回思考过程，true：返回；false（默认值）：不返回。
- 请在 `parameters` 对象中添加 `incremental_output` 数，表示是否增量输出，true：增量输出；false（默认值）：非增量输出。

**请求示例**

**响应示例**

```json
id:1
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"嗯","action_type":"reasoning","response":"嗯","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"null","text":""},"usage":{"models":[{"input_tokens":31,"output_tokens":3,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}

id:2
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"，","action_type":"reasoning","response":"，","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"null","text":""},"usage":{"models":[{"input_tokens":31,"output_tokens":4,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}

id:3
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"用户","action_type":"reasoning","response":"用户","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"null","text":""},"usage":{"models":[{"input_tokens":31,"output_tokens":5,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}
......
id:320
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"","action_type":"reasoning","response":"","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"null","text":"问题"},"usage":{"models":[{"input_tokens":31,"output_tokens":322,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}

id:321
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"","action_type":"reasoning","response":"","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"null","text":"吗"},"usage":{"models":[{"input_tokens":31,"output_tokens":323,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}

id:322
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"","action_type":"reasoning","response":"","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"null","text":"？"},"usage":{"models":[{"input_tokens":31,"output_tokens":324,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}

id:323
event:result
:HTTP_STATUS/200
data:{"output":{"thoughts":[{"action":"reasoning","thought":"","action_type":"reasoning","response":"","action_name":"思考过程"}],"session_id":"ea188f5f795a485f8956e3af0212ba29","finish_reason":"stop","text":""},"usage":{"models":[{"input_tokens":31,"output_tokens":324,"model_id":"deepseek-r1"}]},"request_id":"b4b0b65f-4378-93b6-8ca2-7936b2725bc8"}
```

**检索知识库**

- 模型思考过程在 `thoughts` 的 `thought` 中返回，模型思考的 `action_type` 为 `reasoning` ；
- 检索过程在 `thoughts` 的 `observation` 中返回，检索的 `action_type` 为 `agentRag` 。

可通过 `action_type` 区分不同过程，处理输出内容。

### 长期记忆

阿里云百炼的 **智能体应用** 在和您进行对话时，能够记住一定长度的对话记录，但由于大模型注意力机制的限制，可能会忘记某些信息。为了解决这个问题，您可以将对话过程中的特定信息存储到长期记忆中，应用将在后续对话中持续引用这些信息。

**使用步骤**

**步骤 1: 激活** [长期记忆](https://help.aliyun.com/zh/model-studio/long-term-memory) **功能**

访问 **[应用管理](https://bailian.console.aliyun.com/#/app-center)** 页面，找到您的智能体应用，打开 **长期记忆** 功能开关，并 **发布** 应用。

**步骤 2: 创建长期记忆体**

调用 [CreateMemory](https://help.aliyun.com/zh/model-studio/developer-reference/api-bailian-2023-12-29-creatememory?spm=a2c4g.11186623.0.0.586c6610Kg0bkj) 接口，创建一个长期记忆体，从响应中获得一个唯一的 `memoryId` 。

**步骤 3: 保存对话信息**

调用时传入之前获得的 `memoryId` ， 系统会自动分析并提取您对话中的关键信息，这些信息将被保存为与该 `memoryId` 关联的记忆内容。

**步骤 4: 使用长期记忆进行对话**

每次与智能体交流时提供相同的 `memoryId` ，系统会根据提供的 `memoryId` 召回相应的记忆内容，并将其与当前提问一起传递给模型生成答案。

**调用示例**

Python

Java

HTTP

curl

PHP

Node.js

C#

Go

**需安装相关依赖：**

```sh
npm install axios
```

**请求示例（生成记忆体内容）**

```javascript
const axios = require('axios');

async function callDashScope() {
    //若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID';// 替换为实际的应用 ID
    const memoryId = 'YOUR_MEMORY_ID';// 替换为实际的memory_id

    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        input: {
            prompt: "用户饮食偏好：面食",
            memory_id: memoryId
        },
        parameters: {},
        debug: {}
    };

    try {
        console.log("Sending request to DashScope API...");

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (response.data.output && response.data.output.text) {
                console.log(\`${response.data.output.text}\`);
            }
        } else {
            console.log("Request failed:");
            if (response.data.request_id) {
                console.log(\`request_id=${response.data.request_id}\`);
            }
            console.log(\`code=${response.status}\`);
            if (response.data.message) {
                console.log(\`message=${response.data.message}\`);
            } else {
                console.log('message=Unknown error');
            }
        }
    } catch (error) {
        console.error(\`Error calling DashScope: ${error.message}\`);
        if (error.response) {
            console.error(\`Response status: ${error.response.status}\`);
            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
        }
    }
}

callDashScope();
```

**响应示例**

```json
解了，您对面食情有独钟。如果您想要尝试一些新的面食菜品或是寻找某个特定地方的特色面食，请告诉我，我很乐意为您提供一些建议！
```

**请求示例（再次调用）**

```javascript
const axios = require('axios');

async function callDashScope() {
    //若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = 'YOUR_APP_ID';// 替换为实际的应用 ID
    const memoryId = 'YOUR_MEMORY_ID';// 替换为实际的memory_id

    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;

    const data = {
        input: {
            prompt: "美食推荐",
            memory_id: memoryId
        },
        parameters: {},
        debug: {}
    };

    try {
        console.log("Sending request to DashScope API...");

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': \`Bearer ${apiKey}\`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (response.data.output && response.data.output.text) {
                console.log(\`${response.data.output.text}\`);
            }
        } else {
            console.log("Request failed:");
            if (response.data.request_id) {
                console.log(\`request_id=${response.data.request_id}\`);
            }
            console.log(\`code=${response.status}\`);
            if (response.data.message) {
                console.log(\`message=${response.data.message}\`);
            } else {
                console.log('message=Unknown error');
            }
        }
    } catch (error) {
        console.error(\`Error calling DashScope: ${error.message}\`);
        if (error.response) {
            console.error(\`Response status: ${error.response.status}\`);
            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
        }
    }
}

callDashScope();
```

**响应示例**

```json
既然您偏好面食，这里有一些建议供您参考：

1. **刀削面**：这种面条以其独特的口感和形状闻名，可以搭配各种美味的汤底和配料。
2. **担担面**：四川风味的辣味面条，用花生酱、辣椒油等调料制成，味道鲜美而富有层次感。
3. **炸酱面**：北京的传统美食之一，主要由黄豆酱炒肉末制成的酱料拌入煮好的面条中食用。
4. **意大利面**：如果您想尝试一些不同的口味，可以选择意式面食。比如番茄肉酱意面或是奶油蘑菇意面等。

希望这些建议对您有所帮助！如果还有其他需求或想要更具体的推荐，请告诉我。
```

### 上传文件（文档、图片、视频或音频）

在 **智能体应用** 内，您可上传文件（文档、图片、视频或音频），并基于文件内容进行问答。

#### 使用场景

- **文本解析** ：解析文档、图片、视频或音频中的 **文字内容** ，结合大模型回答问题。
- **视觉理解** ：通过 **通义千问VL系列模型** 分析图片中的 **图像内容** （如物体、场景、动作等），无需依赖文字信息。

如需在控制台操作上传文件并与大模型进行问答请参阅 [上传文件](https://help.aliyun.com/zh/model-studio/user-guide/file-interaction?spm=a2c4g.11186623.help-menu-search-2400256.d_0) 。

API方式操作请参阅以下内容。

文本解析

视觉理解

**步骤一：准备文件**

待上传的文件需满足以下要求。

支持上传的文件上限10个。支持上传本地的文档、图片、视频或音频，格式要求为：

- 文档（单文件不超过100MB）：.doc,.docx,.wps,.ppt,.pptx,.xls,.xlsx,.md,.txt,.pdf；
- 图片（单文件不超过20MB）：.png,.jpg,.jpeg,.bmp,.gif；
	目前仅支持上传包含文字内容的本地图片。
- 视频（单文件不超过512MB）：.mp4,.mkv,.avi,.mov,.wmv；
- 音频（单文件不超过512MB）：.aac,.amr,.flac,.flv,.m4a,.mp3,.mpeg,.ogg,.opus,.wav,.webm,.wma。

##### 步骤二：获取会话文件ID

1. 通过本文的获取以“ file\_session ”开头的 会话文件ID；
2. 验证文件状态为 FILE\_IS\_READY 。
![image](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7519976571/CAEQWhiBgICSiLDquBkiIDA3ODdmMzY4NTMyNTQ5OGE4NWM4MThjNTM5YTMwZjE05224266_20250529113200.258.svg)

**步骤三：API调用应用**

1. 在控制台 **智能体应用** 内选择任一模型，开启 **动态文件解析** 开关，并 **发布** 应用。
	**说明**
	您的智能体应用与步骤二中上传的文件需位于同一业务空间内。
2. API调用时，通过参数 `session_file_ids` 传递步骤二中获取的会话文件ID，调用示例如下：
	> Java SDK中为sessionFileIds。通过HTTP调用时，请将 `session_file_ids` 放入 parameters 对象中。
	**重要**
	获取的会话文件ID必须以“ `file_session_` ”开头，且文件状态为 FILE\_IS\_READY 。如果未满足条件，调用将会失败。
	Python
	Java
	HTTP
	curl
	PHP
	Node.js
	C#
	Go
	**需安装相关依赖：**
	```sh
	npm install axios
	```
	**请求示例**
	```javascript
	const axios = require('axios');
	async function callDashScope() {
	    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey='sk-xxx'。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	    const apiKey = process.env.DASHSCOPE_API_KEY;
	    const appId = 'YOUR_APP_ID';//替换为实际的应用 ID
	    const url = \`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion\`;
	    const data = {
	        input: {
	            prompt: "请根据以下文件帮我推荐一款3000元以下的手机"
	        },
	        parameters: {
	            rag_options:{
	                session_file_ids:['YOUR_FILE_ID1']  // 替换为指定的临时文件 ID，多个请用逗号隔开
	            }
	        },
	        debug: {}
	    };
	    try {
	        const response = await axios.post(url, data, {
	            headers: {
	                'Authorization': \`Bearer ${apiKey}\`,
	                'Content-Type': 'application/json'
	            }
	        });
	        if (response.status === 200) {
	            console.log(\`${response.data.output.text}\`);
	        } else {
	            console.log(\`request_id=${response.headers['request_id']}\`);
	            console.log(\`code=${response.status}\`);
	            console.log(\`message=${response.data.message}\`);
	        }
	    } catch (error) {
	        console.error(\`Error calling DashScope: ${error.message}\`);
	        if (error.response) {
	            console.error(\`Response status: ${error.response.status}\`);
	            console.error(\`Response data: ${JSON.stringify(error.response.data, null, 2)}\`);
	        }
	    }
	}
	callDashScope();
	```
	**响应示例**
	```json
	根据您的预算（3000元以下），我为您推荐**通义 Vivid 7**这款手机。
	### 推荐理由：
	- **屏幕表现良好**：6.5英寸1080 x 2400像素全面屏，视觉效果细腻。
	- **AI智能摄影**：支持AI智能摄影功能，能够自动优化照片色彩与细节，让您轻松拍出专业级照片。
	- **充足的内存和存储空间**：配备8GB RAM + 128GB存储组合，满足日常使用及娱乐需求。
	- **持久续航**：内置4500mAh大容量电池，保障一天的正常使用。
	- **便捷安全解锁方式**：采用侧面指纹解锁设计，既快速又方便。
	- **价格合理**：参考售价为2999-3299元，在您的预算范围内。
	综上所述，如果您对摄影有一定兴趣且追求性价比的话，通义 Vivid 7将是不错的选择。当然，具体购买时请以官方渠道或授权零售商提供的最新信息为准。
	```

##### 通过API接口获取会话文件ID

**操作步骤**

1. **申请文件上传租约**
	[在线调试](https://api.aliyun.com/api/bailian/2023-12-29/ApplyFileUploadLease) ApplyFileUploadLease接口。
	<table><tbody><tr><td rowspan="1" colspan="1"><p><b>发起调用图示</b></p></td><td rowspan="1" colspan="1"><p><b>重要参数说明</b></p></td></tr><tr><td rowspan="5" colspan="1"><p><img src="https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1194987471/p958857.png" width="450" height="554.001"></p></td><td rowspan="1" colspan="1"><p><b>CategoryId</b>: 务必填写 <span>default</span> 。</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>FileName</b> ：文件名称+后缀。</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>Md5: </b>可运行此处示例代码获取该文件的Md5值。</p><p><span></span></p><p><b>生成MD5示例代码</b></p><p></p><p>Python</p><p>Java</p><div><pre><code># 示例代码仅供参考，请勿在生产环境中直接使用
	import hashlib
	def calculate_md5(file_path):
	    """计算文档的 MD5 值。
	    Args:
	        file_path (str): 文档的路径。
	    Returns:
	        str: 文档的 MD5 值。
	    """
	    md5_hash = hashlib.md5()
	    # 以二进制形式读取文件
	    with open(file_path, "rb") as f:
	        # 按块读取文件，避免大文件占用过多内存
	        for chunk in iter(lambda: f.read(4096), b""):
	            md5_hash.update(chunk)
	    return md5_hash.hexdigest()
	# 使用示例
	file_path = "请替换为您需要上传文档的实际本地路径，例如/Users/Bailian/Desktop/阿里云百炼系列手机产品介绍.docx"
	md5_value = calculate_md5(file_path)
	print(f"文档的MD5值为: {md5_value}")</code></pre></div><div><pre><code>// 示例代码仅供参考，请勿在生产环境中直接使用
	import java.io.InputStream;
	import java.nio.file.Files;
	import java.nio.file.Paths;
	import java.security.MessageDigest;
	public class Md5Utils {
	    private static String getFileMd5(String filePath) throws Exception {
	        MessageDigest digest = MessageDigest.getInstance("MD5");
	        try (InputStream is = Files.newInputStream(Paths.get(filePath))) {
	            byte[] buffer = new byte[1024];
	            int read;
	            while ((read = is.read(buffer)) &gt; 0) {
	                digest.update(buffer, 0, read);
	            }
	        }
	        byte[] md5Bytes = digest.digest();
	        StringBuilder md5String = new StringBuilder();
	        for (byte b : md5Bytes) {
	            md5String.append(String.format("%02x", b));
	        }
	        return md5String.toString();
	    }
	    public static void main(String[] args) throws Exception {
	        String filePath = "请替换为您需要上传文档的实际本地路径，例如/Users/Bailian/Desktop/阿里云百炼系列手机产品介绍.docx";
	        String md5 = getFileMd5(filePath);
	        System.out.println("文档的MD5值为: " + md5);
	    }
	}</code></pre></div></td></tr><tr><td rowspan="1" colspan="1"><p><b>SizeInBytes</b> ：文件大小，单位为字节。 <span>例如：6 KB = 6 * 1024 字节 = 6144 字节。</span></p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CategoryType</b>: 务必填写 <span>SESSION_FILE</span> 。</p></td></tr></tbody></table>
	<table><tbody><tr><td rowspan="1" colspan="1"><p><b>调用成功图示</b> <img src="https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1194987471/p958861.png" width="950" height="365.797"></p></td></tr><tr><td rowspan="1" colspan="1"><p><b>说明</b></p><ol><li><p>此接口响应中的 <code>Data.FileUploadLeaseId</code> 、 <code>Data.Param.Method</code> 、 <code>Data.Param.Url</code> 、Data.Param.Headers.X-bailian-extra和 <code>Data.Param.Headers.Content-Type</code> 字段的值请妥善保存，它们将用于后续的上传步骤。</p></li><li><p>此接口响应中的 <code>Data.Param.Url</code> 字段的值（即租约）有效期为分钟级，请尽快上传文档，以免租约过期导致无法上传。</p></li></ol></td></tr></tbody></table>
2. **上传文件至阿里云百炼的临时存储**
	示例代码如下，请根据代码提示替换上一步获取的实际字段值，然后运行代码。若响应为“ File uploaded successfully.”，则表示上传成功。
	**示例代码**
	多语言示例请自行编写。
	Python
	Java
	```python
	# 示例代码仅供参考，请勿在生产环境中直接使用
	import requests
	from urllib.parse import urlparse
	def upload_file(pre_signed_url, file_path):
	    try:
	        # 设置请求头
	        headers = {
	            "X-bailian-extra": "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中X-bailian-extra字段的值",
	            "Content-Type": "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中Content-Type字段的值"
	        }
	        # 读取文档并上传
	        with open(file_path, 'rb') as file:
	            # 下方设置请求方法用于文档上传，需与您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param中Method字段的值一致
	            response = requests.put(pre_signed_url, data=file, headers=headers)
	        # 检查响应状态码
	        if response.status_code == 200:
	            print("File uploaded successfully.")
	        else:
	            print(f"Failed to upload the file. ResponseCode: {response.status_code}")
	    except Exception as e:
	        print(f"An error occurred: {str(e)}")
	def upload_file_link(pre_signed_url, source_url_string):
	    try:
	        # 设置请求头
	        headers = {
	            "X-bailian-extra": "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中X-bailian-extra字段的值",
	            "Content-Type": "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中Content-Type字段的值"
	        }
	        # 设置访问OSS的请求方法为GET
	        source_response = requests.get(source_url_string)
	        if source_response.status_code != 200:
	            raise RuntimeError("Failed to get source file.")
	        # 下方设置请求方法用于文档上传，需与您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param中Method字段的值一致
	        response = requests.put(pre_signed_url, data=source_response.content, headers=headers)
	        # 检查响应状态码
	        if response.status_code == 200:
	            print("File uploaded successfully.")
	        else:
	            print(f"Failed to upload the file. ResponseCode: {response.status_code}")
	    except Exception as e:
	        print(f"An error occurred: {str(e)}")
	if __name__ == "__main__":
	    pre_signed_url_or_http_url = "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param中Url字段的值"
	    # 文档来源可以是本地，上传本地文档至百炼临时存储
	    file_path = "请替换为您需要上传文档的实际本地路径"
	    upload_file(pre_signed_url_or_http_url, file_path)
	    # 文档来源还可以是阿里云对象存储OSS
	    # file_path = "请替换为您需要上传文档的实际阿里云对象存储OSS可公网访问地址"
	    # upload_file_link(pre_signed_url_or_http_url, file_path)
	```
	```java
	// 示例代码仅供参考，请勿在生产环境中直接使用
	import java.io.BufferedInputStream;
	import java.io.DataOutputStream;
	import java.io.FileInputStream;
	import java.io.InputStream;
	import java.net.HttpURLConnection;
	import java.net.URL;
	public class UploadFile{
	    public static void uploadFile(String preSignedUrl, String filePath) {
	        HttpURLConnection connection = null;
	        try {
	            // 创建URL对象
	            URL url = new URL(preSignedUrl);
	            connection = (HttpURLConnection) url.openConnection();
	            // 设置请求方法用于文档上传，需与您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param中Method字段的值一致
	            connection.setRequestMethod("PUT");
	            // 允许向connection输出，因为这个连接是用于上传文档的
	            connection.setDoOutput(true);
	            connection.setRequestProperty("X-bailian-extra", "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中X-bailian-extra字段的值");
	            connection.setRequestProperty("Content-Type", "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中Content-Type字段的值");
	            // 读取文档并通过连接上传
	            try (DataOutputStream outStream = new DataOutputStream(connection.getOutputStream());
	                 FileInputStream fileInputStream = new FileInputStream(filePath)) {
	                byte[] buffer = new byte[4096];
	                int bytesRead;
	                while ((bytesRead = fileInputStream.read(buffer)) != -1) {
	                    outStream.write(buffer, 0, bytesRead);
	                }
	                outStream.flush();
	            }
	            // 检查响应
	            int responseCode = connection.getResponseCode();
	            if (responseCode == HttpURLConnection.HTTP_OK) {
	                // 文档上传成功处理
	                System.out.println("File uploaded successfully.");
	            } else {
	                // 文档上传失败处理
	                System.out.println("Failed to upload the file. ResponseCode: " + responseCode);
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            if (connection != null) {
	                connection.disconnect();
	            }
	        }
	    }
	    public static void uploadFileLink(String preSignedUrl, String sourceUrlString) {
	        HttpURLConnection connection = null;
	        try {
	            // 创建URL对象
	            URL url = new URL(preSignedUrl);
	            connection = (HttpURLConnection) url.openConnection();
	            // 设置请求方法用于文档上传，需与您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param中Method字段的值一致
	            connection.setRequestMethod("PUT");
	            // 允许向connection输出，因为这个连接是用于上传文档的
	            connection.setDoOutput(true);
	            connection.setRequestProperty("X-bailian-extra", "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中X-bailian-extra字段的值");
	            connection.setRequestProperty("Content-Type", "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param.Headers中Content-Type字段的值");
	            URL sourceUrl = new URL(sourceUrlString);
	            HttpURLConnection sourceConnection = (HttpURLConnection) sourceUrl.openConnection();
	            // 设置访问OSS的请求方法为GET
	            sourceConnection.setRequestMethod("GET");
	            // 获取响应码，200表示请求成功
	            int sourceFileResponseCode = sourceConnection.getResponseCode();
	            // 从OSS读取文档并通过连接上传
	            if (sourceFileResponseCode != HttpURLConnection.HTTP_OK){
	                throw new RuntimeException("Failed to get source file.");
	            }
	            try (DataOutputStream outStream = new DataOutputStream(connection.getOutputStream());
	                 InputStream in = new BufferedInputStream(sourceConnection.getInputStream())) {
	                byte[] buffer = new byte[4096];
	                int bytesRead;
	                while ((bytesRead = in.read(buffer)) != -1) {
	                    outStream.write(buffer, 0, bytesRead);
	                }
	                outStream.flush();
	            }
	            // 检查响应
	            int responseCode = connection.getResponseCode();
	            if (responseCode == HttpURLConnection.HTTP_OK) {
	                // 文档上传成功
	                System.out.println("File uploaded successfully.");
	            } else {
	                // 文档上传失败
	                System.out.println("Failed to upload the file. ResponseCode: " + responseCode);
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            if (connection != null) {
	                connection.disconnect();
	            }
	        }
	    }
	    public static void main(String[] args) {
	        String preSignedUrlOrHttpUrl = "请替换为您在上一步中调用ApplyFileUploadLease接口实际返回的Data.Param中Url字段的值";
	        // 文档来源可以是本地，上传本地文档至百炼临时存储
	        String filePath = "请替换为您需要上传文档的实际本地路径";
	        uploadFile(preSignedUrlOrHttpUrl, filePath);
	        // 文档来源还可以是OSS
	        // String filePath = "请替换为您需要上传文档的实际OSS可公网访问地址";
	        // uploadFileLink(preSignedUrlOrHttpUrl, filePath);
	    }
	}
	```
3. **将文件添加至阿里云百炼的数据管理**
	上一步操作成功后，文档将暂存于阿里云百炼的临时存储空间内 12 小时，通过 [在线调试](https://api.aliyun.com/api/bailian/2023-12-29/AddFile) AddFile接口获取会话文件ID。
	<table><tbody><tr><td rowspan="1" colspan="1"><p><b>配置图示</b></p></td><td rowspan="1" colspan="1"><p><b>重要参数说明</b></p></td></tr><tr><td rowspan="3" colspan="1"><p><img src="https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1194987471/p958862.png" width="300" height="500"></p></td><td rowspan="1" colspan="1"><p><b>LeaseId</b> ：第一步接口响应中的 <code>Data.FileUploadLeaseId</code> 字段值。</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CategoryId</b>: 务必填写 <span>default</span> 。</p></td></tr><tr><td rowspan="1" colspan="1"><p><b>CategoryType</b>: 务必填写 <span>SESSION_FILE</span> 。</p></td></tr></tbody></table>
	<table><tbody><tr><td rowspan="1" colspan="1"><p><b>调用成功图示</b></p><p><img src="https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1194987471/p958863.png" width="950" height="347.687"></p></td></tr><tr><td rowspan="1" colspan="1"><p><b>说明</b></p><ul><li><p>获取会话文件ID。示例：" <span>file_session_6c6bb33339524b7xxx</span> "。</p><p><strong>重要</strong></p><p>仅以“ <span>file_session_</span> ”开头的ID才能用于下一步的API调用。如未满足，请核实步骤中的重要参数CategoryId和CategoryType是否填写正确。</p></li><li><p>AddFile接口调用成功后， <code>LeaseId</code> （租约 ID）随即失效，请勿再使用相同的租约 ID 重复提交。</p></li></ul></td></tr></tbody></table>
4. **查看文档解析状态**
	通过 [在线调试](https://api.aliyun.com/api/bailian/2023-12-29/DescribeFile) DescribeFile接口查看文档解析状态。
	<table><tbody><tr><td rowspan="1" colspan="1"><p><b>状态码</b></p></td><td rowspan="1" colspan="1"><p><b>说明</b></p></td></tr><tr><td rowspan="1" colspan="1"><p><code>INIT</code></p></td><td rowspan="1" colspan="1"><p>文件已上传，等待解析。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>PARSING</code></p></td><td rowspan="1" colspan="1"><p>正在解析文件内容。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>PARSE_SUCCESS</code></p></td><td rowspan="1" colspan="1"><p>文件解析成功。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>PARSE_FAILED</code></p></td><td rowspan="1" colspan="1"><p>文件解析失败，需重新上传。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>SAFE_CHECKING</code></p></td><td rowspan="1" colspan="1"><p>正在进行文件安全检测。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>SAFE_CHECK_FAILED</code></p></td><td rowspan="1" colspan="1"><p>文件未通过安全检测，需重新上传或更换文件。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>INDEX_BUILDING</code></p></td><td rowspan="1" colspan="1"><p>正在为文件构建索引。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>INDEX_BUILD_SUCCESS</code></p></td><td rowspan="1" colspan="1"><p>文件索引构建完成。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>INDEX_BUILDING_FAILED</code></p></td><td rowspan="1" colspan="1"><p>索引构建失败，需重新上传文件。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>INDEX_DELETED</code></p></td><td rowspan="1" colspan="1"><p>文件索引已删除。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>FILE_IS_READY</code></p></td><td rowspan="1" colspan="1"><p>文件准备完毕：文件解析、安全检测、索引构建均已完成。</p></td></tr><tr><td rowspan="1" colspan="1"><p><code>FILE_EXPIRED</code></p></td><td rowspan="1" colspan="1"><p>文件过期。 文件仅在当前会话有效（最长7天），关闭会话后自动过期，需重新上传文件。</p></td></tr></tbody></table>
	**重要**
	必须等到 `Status` 字段值显示为 `FILE_IS_READY` 才能开始后续的API调用。
	![image](https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1194987471/p958899.png)
5. 完成有效的会话文件ID获取后，可进入上述步骤三：API调用应用。

如需查看上述获取ID步骤中的接口参数详细说明请参阅 [API上传文件](https://help.aliyun.com/zh/model-studio/developer-reference/upload-files-by-calling-api?spm=a2c4g.11186623.0.0.2e2183749WPvAJ) 。

**操作步骤**

1. 在控制台 **智能体应用** 内选择 **通义千问VL系列模型** ，开启 **视觉** 开关，并 **发布** 应用。
2. API调用时，通过参数 `image_list` 传入图像URL，可以传入多张图像URL。调用示例如下：
	> Java SDK中为images接口。通过HTTP调用时，请将 image\_list 放入 input 对象中。
	Python
	Java
	HTTP
	**请求示例**
	```python
	import os
	from http import HTTPStatus
	# 建议dashscope SDK 的版本 >= 1.20.14
	from dashscope import Application
	response = Application.call(
	    # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	    api_key=os.getenv("DASHSCOPE_API_KEY"), 
	    app_id='YOUR_APP_ID',  # 应用ID替换YOUR_APP_ID
	    prompt='图中描绘的是什么景象?',
	    image_list=["https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg"],  # 替换为实际的图片链接，逗号隔开多个
	)
	if response.status_code != HTTPStatus.OK:
	    print(f'request_id={response.request_id}')
	    print(f'code={response.status_code}')
	    print(f'message={response.message}')
	    print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
	else:
	    print('%s\n' % (response.output.text))  # 处理只输出文本text
	    # print('%s\n' % (response.usage))
	```
	**响应示例**
	```json
	图中描绘的是一个女人和一只狗在海滩上互动的景象。女人坐在沙滩上，面带微笑地与狗握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。
	```
	**请求示例**
	```java
	// 建议dashscope SDK 的版本 >= 2.17.0；
	import com.alibaba.dashscope.app.*;
	import com.alibaba.dashscope.exception.ApiException;
	import com.alibaba.dashscope.exception.InputRequiredException;
	import com.alibaba.dashscope.exception.NoApiKeyException;
	import com.google.gson.JsonObject;
	import java.util.List;
	public class Main {
	    public static void appCall() throws NoApiKeyException, InputRequiredException {
	        ApplicationParam param = ApplicationParam.builder()
	                // 若没有配置环境变量，可用百炼API Key将下行替换为：.apiKey("sk-xxx")。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
	                .appId("YOUR_APP_ID") // 替换为实际的应用ID
	                .prompt("图中描绘的是什么景象?")
	                .images(List.of("https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg"))  // 替换为实际的图片链接，逗号隔开多个
	                .build();
	        Application application = new Application();
	        ApplicationResult result = application.call(param);
	        System.out.printf("%s\n",
	                result.getOutput().getText());// 处理只输出文本text
	    }
	    public static void main(String[] args) {
	        try {
	            appCall();
	        } catch (ApiException | NoApiKeyException | InputRequiredException e) {
	            System.out.printf("Exception: %s", e.getMessage());
	            System.out.println("请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code");
	        }
	        System.exit(0);
	    }
	}
	```
	**响应示例**
	```json
	图中描绘的是一个女人和一只狗在海滩上互动的景象。女人坐在沙滩上，面带微笑地与狗握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。
	```
	curl
	PHP
	Node.js
	C#
	Go
	**请求示例**
	**响应示例**
	```json
	{
	    "output": {
	        "finish_reason": "stop",
	        "session_id": "6c67678038e14f138f384e477e7126f6",
	        "text": "图中描绘的是一个女人和一只狗在海滩上互动的景象。女人坐在沙滩上，面带微笑地与狗握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。"
	    },
	    "usage": {
	        "models": [
	            {
	                "output_tokens": 49,
	                "model_id": "qwen-vl-max",
	                "input_tokens": 1305
	            }
	        ]
	    },
	    "request_id": "4a8a6a76-eecd-9298-a0fb-16a4c8f9a205"
	}
	```
	**请求示例**
	```php
	<?php
	# 若没有配置环境变量，可用百炼API Key将下行替换为：$api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	$api_key = getenv("DASHSCOPE_API_KEY");
	$application_id = 'YOUR_APP_ID'; // 替换为实际的应用 ID
	$url = "https://dashscope.aliyuncs.com/api/v1/apps/$application_id/completion";
	// 构造请求数据
	$data = [
	    "input" => [
	        'prompt' => '图中描绘的是什么景象?',   
	        'image_list' => ['https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg']//替换为实际的图片链接,逗号隔开多个 
	    ]
	];
	// 将数据编码为 JSON
	$dataString = json_encode($data);
	// 检查 json_encode 是否成功
	if (json_last_error() !== JSON_ERROR_NONE) {
	    die("JSON encoding failed with error: " . json_last_error_msg());
	}
	// 初始化 cURL 对话
	$ch = curl_init($url);
	// 设置 cURL 选项
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
	    'Content-Type: application/json',
	    'Authorization: Bearer ' . $api_key
	]);
	// 执行请求
	$response = curl_exec($ch);
	// 检查 cURL 执行是否成功
	if ($response === false) {
	    die("cURL Error: " . curl_error($ch));
	}
	// 获取 HTTP 状态码
	$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	// 关闭 cURL 对话
	curl_close($ch);
	// 解码响应数据
	$response_data = json_decode($response, true);
	// 处理响应
	if ($status_code == 200) {
	    if (isset($response_data['output']['text'])) {
	        echo "{$response_data['output']['text']}\n";
	    } else {
	        echo "No text in response.\n";
	    }
	} else {
	    if (isset($response_data['request_id'])) {
	        echo "request_id={$response_data['request_id']}\n";}
	    echo "code={$status_code}\n";
	    if (isset($response_data['message'])) {
	        echo "message={$response_data['message']}\n";} 
	    else {
	        echo "message=Unknown error\n";}
	}
	?>
	```
	**响应示例**
	```json
	图中描绘的是一个女人和一只狗在海滩上互动的景象。女人坐在沙滩上，面带微笑地与狗握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。
	```
	**需安装相关依赖：**
	```sh
	npm install axios
	```
	**请求示例**
	**响应示例**
	```json
	图中描绘的是一个女人和一只狗在海滩上互动的景象。女人坐在沙滩上，面带微笑地与狗握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。
	```
	**请求示例**
	```csharp
	using System.Text;
	class Program
	{
	    static async Task Main(string[] args)
	    {
	        // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	        string apiKey = Environment.GetEnvironmentVariable("DASHSCOPE_API_KEY")?? throw new InvalidOperationException("DASHSCOPE_API_KEY environment variable is not set.");;
	        string appId = "YOUR_APP_ID";// 替换为实际的应用ID
	        
	        if (string.IsNullOrEmpty(apiKey))
	        {
	            Console.WriteLine("请确保设置了 DASHSCOPE_API_KEY。");
	            return;
	        }
	        string url = $"https://dashscope.aliyuncs.com/api/v1/apps/{appId}/completion";
	        // image_list中替换为实际的图片链接，如果多个图片链接请用逗号隔开
	        using (HttpClient client = new HttpClient())
	        {
	            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
	            string jsonContent = $@"{{
	                ""input"": {{
	                    ""prompt"": ""图中描绘的是什么景象?"",
	                    ""image_list"":[""https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg""
	                                ]
	                }},
	                ""debug"": {{}}
	            }}";
	            HttpContent content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
	            try
	            {
	                HttpResponseMessage response = await client.PostAsync(url, content);
	                if (response.IsSuccessStatusCode)
	                {
	                    string responseBody = await response.Content.ReadAsStringAsync();
	                    Console.WriteLine(responseBody);
	                }
	                else
	                {
	                    Console.WriteLine($"Request failed with status code: {response.StatusCode}");
	                    string responseBody = await response.Content.ReadAsStringAsync();
	                    Console.WriteLine(responseBody);
	                }
	            }
	            catch (Exception ex)
	            {
	                Console.WriteLine($"Error calling DashScope: {ex.Message}");
	            }
	        }
	    }
	}
	```
	**响应示例**
	```json
	{
	    "output": {
	        "finish_reason": "stop",
	        "session_id": "5149b58d713e49ed80c30372aee377ae",
	        "text": "图中描绘的是一个女人和一只狗在海滩上互动的景象。女人坐在沙滩上，面带微笑地与狗握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。"
	    },
	    "usage": {
	        "models": [
	            {
	                "output_tokens": 49,
	                "model_id": "qwen-vl-max",
	                "input_tokens": 1305
	            }
	        ]
	    },
	    "request_id": "702810f5-d21d-9b74-8b4f-e58d0a8da413"
	}
	```
	**请求示例**
	```json
	package main
	import (
	    "bytes"
	    "encoding/json"
	    "fmt"
	    "io"
	    "net/http"
	    "os"
	)
	func main() {
	    // 若没有配置环境变量，可用百炼API Key将下行替换为：apiKey := "sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
	    apiKey := os.Getenv("DASHSCOPE_API_KEY")
	    appId := "YOUR_APP_ID" // 替换为实际的应用 ID
	    if apiKey == "" {
	        fmt.Println("请确保设置了DASHSCOPE_API_KEY。")
	        return
	    }
	    url := fmt.Sprintf("https://dashscope.aliyuncs.com/api/v1/apps/%s/completion", appId)
	    // 创建请求体
	    requestBody := map[string]interface{}{
	        "input": map[string]interface{}{
	            "prompt":     "图中描绘的是什么景象?",
	            "image_list": []string{"https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg", "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20241022/emyrja/dog_and_girl.jpeg"}, // 替换为实际的图片链接,多个请用逗号隔开
	        },
	        "debug": map[string]interface{}{},
	    }
	    jsonData, err := json.Marshal(requestBody)
	    if err != nil {
	        fmt.Printf("Failed to marshal JSON: %v\n", err)
	        return
	    }
	    // 创建 HTTP POST 请求
	    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	    if err != nil {
	        fmt.Printf("Failed to create request: %v\n", err)
	        return
	    }
	    // 设置请求头
	    req.Header.Set("Authorization", "Bearer "+apiKey)
	    req.Header.Set("Content-Type", "application/json")
	    // 发送请求
	    client := &http.Client{}
	    resp, err := client.Do(req)
	    if err != nil {
	        fmt.Printf("Failed to send request: %v\n", err)
	        return
	    }
	    defer resp.Body.Close()
	    // 读取响应
	    body, err := io.ReadAll(resp.Body)
	    if err != nil {
	        fmt.Printf("Failed to read response: %v\n", err)
	        return
	    }
	    // 处理响应
	    if resp.StatusCode == http.StatusOK {
	        fmt.Println("Request successful:")
	        fmt.Println(string(body))
	    } else {
	        fmt.Printf("Request failed with status code: %d\n", resp.StatusCode)
	        fmt.Println(string(body))
	    }
	}
	```
	**响应示例**
	```json
	{
	    "output": {
	        "finish_reason": "stop",
	        "session_id": "8a3d495588d34c2e99ea42b12d265c31",
	        "text": "图中描绘的是一个女人和一只狗在海滩上互动的景象。女人穿着格子衬衫，坐在沙滩上，与她的宠物狗进行亲密的互动。狗狗戴着项圈，伸出前爪与女人握手，显得非常友好和温顺。背景是广阔的海洋和天空，阳光洒在她们身上，营造出一种温暖和谐的氛围。这张照片捕捉到了人与动物之间美好的友谊时刻。"
	    },
	    "usage": {
	        "models": [
	            {
	                "output_tokens": 88,
	                "model_id": "qwen-vl-max",
	                "input_tokens": 2554
	            }
	        ]
	    },
	    "request_id": "22db4110-6c7b-9b06-8769-c8a1a3edfd39"
	}
	```

### 私网调用

为提高数据传输的安全性和效率，您可通过私网调用阿里云百炼平台的应用。

1. [创建终端节点](https://help.aliyun.com/zh/model-studio/access-model-studio-through-privatelink#b49f50b6202nn) ：在阿里云控制台为您的VPC创建一个私网终端节点。
2. **替换域名** ：将API请求URL中的公网域名 `dashscope.aliyuncs.com` 替换为您获取到的私网终端节点服务域名。例如：
	`https://ep-2zei6917b47eed******.dashscope.cn-beijing.privatelink.aliyuncs.com/api/v1/`
3. 发起请求：示例代码如下。
	Python
	Java
	HTTP

## API参考

通过 [应用调用API参考](https://help.aliyun.com/zh/model-studio/call-application-through-api) 查看完整的参数列表。

## 错误码

如果调用失败并返回报错信息，请参阅 [错误信息](https://help.aliyun.com/zh/model-studio/error-code) 进行解决。

## 相关文档

- 在调用应用时，如需将模型回复的文本信息转成语音，请参阅 [语音合成-CosyVoice/Sambert](https://help.aliyun.com/zh/model-studio/text-to-speech) 。
- 关于应用的构建和使用请参阅 [智能体应用](https://help.aliyun.com/zh/model-studio/single-agent-application) 。
- 关于应用内Prompt辅助工具的使用请参阅 [Prompt工程](https://help.aliyun.com/zh/model-studio/user-guide/use-prompt-engineering-to-communicate-with-large-models) 。
- 在前端生产环境下使用请参阅 [10分钟给网站添加AI助手](https://help.aliyun.com/zh/model-studio/add-an-ai-assistant-to-your-website-in-10-minutes) 。

## 常见问题

**运行Java代码示例时，如果出现类似“java: 程序包com.alibaba.dashscope.app不存在”的异常信息，应该怎么处理？**

1. 检查导入语句中的类名和包名是否正确。
2. 添加依赖库：如果使用Maven或Gradle进行项目管理，确保DashScope Java SDK依赖库已经添加到 `pom.xml` 或 `build.gradle` 文件中，且为最新版本。访问 [Maven](https://mvnrepository.com/artifact/com.alibaba/dashscope-sdk-java) 获取DashScope Java SDK的最新版本号。
	XML
	Gradle
	```xml
	<!-- https://mvnrepository.com/artifact/com.alibaba/dashscope-sdk-java -->
	<dependency>
	    <groupId>com.alibaba</groupId>
	    <artifactId>dashscope-sdk-java</artifactId>
	    <version>在此处填写最新版本号，例如2.16.4</version>
	</dependency>
	```
	```gradle
	// https://mvnrepository.com/artifact/com.alibaba/dashscope-sdk-java
	implementation group: 'com.alibaba', name: 'dashscope-sdk-java', version: '在此处填写最新版本号，例如2.16.4'
	```
3. 升级SDK：旧版本的DashScope Java SDK可能不包含您尝试使用的功能或类。如果您已经添加过依赖库DashScope Java SDK，请确认您所使用的DashScope Java SDK是否为最新版。如果当前版本较低，请将其升级至最新版本。可在 `pom.xml` 或 `build.gradle` 文件中修改DashScope Java SDK的版本为最新版本。
	XML
	Gradle
	```xml
	<!-- https://mvnrepository.com/artifact/com.alibaba/dashscope-sdk-java -->
	<dependency>
	    <groupId>com.alibaba</groupId>
	    <artifactId>dashscope-sdk-java</artifactId>
	    <version>请将此处的版本号修改为最新版本</version>
	</dependency>
	```
	```gradle
	// https://mvnrepository.com/artifact/com.alibaba/dashscope-sdk-java
	implementation group: 'com.alibaba', name: 'dashscope-sdk-java', version: '请将此处的版本号修改为最新版本'
	```
4. 重新加载项目使更改生效。
5. 重新运行代码示例。

**多轮对话** `**（session_id）**` **与长期记忆** `**（memory_id**` **）有什么区别？**

- `session_id` ： 用于云端托管的多轮对话，自动维护对话上下文。 有效期1小时，最大历史轮数50。 无需调用者自行维护上下文，但需在下一轮对话中传入上一轮对话的 `session_id` 。
- `memory_id` ： 用于创建长期记忆体，存储特定信息。 需调用 [CreateMemory](https://help.aliyun.com/zh/model-studio/developer-reference/api-bailian-2023-12-29-creatememory?spm=a2c4g.11186623.0.0.586c6610Kg0bkj) 接口创建，获取 `memoryId` 。 在后续对话中引用特定信息，需传入 `memoryId` 。

两者分别服务于短期对话和长期信息存储。

- 本页导读 （1）

- 前提条件

- 快速开始

- 核心功能

- 多轮对话

- 流式输出

- 传递自定义参数

- 进阶功能

- 检索知识库

- 深度思考

- 长期记忆

- 上传文件（文档、图片、视频或音频）

- 私网调用

- API参考

- 错误码

- 相关文档

- 常见问题

[![](https://img.alicdn.com/imgextra/i2/O1CN018yfMwK1O05LxJScxL_!!6000000001642-2-tps-144-464.png)](https://smartservice.console.aliyun.com/service/pre-sales-chat)[AI助理](https://www.aliyun.com/ai-assistant?displayMode=widget)

点击开启售前

在线咨询服务

你好，我是AI助理

可以解答问题、推荐解决方案等

![登录插画](https://img.alicdn.com/imgextra/i2/O1CN015QIT9m1FmmyUntYlQ_!!6000000000530-2-tps-320-200.png)

登录以查看您的控制台资源

管理云资源

状态一览

快捷访问

[登录阿里云](https://account.aliyun.com/login/login.htm?oauth_callback=https%3A%2F%2Fhelp.aliyun.com%2Fzh%2Fmodel-studio%2Fcall-single-agent-application)