interface Props {
  api_url: string;
  title: string;
  message: string;
  group?: string;
}

export async function notify({ api_url, title, message, group }: Props) {
  // 1. 确保 api_url 结尾没有多余的斜杠
  const baseUrl = api_url.replace(/\/+$/, "");

  // 2. 构造请求体
  const body = {
    title,
    body: message,
    group,
  };

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Bark 通知发送失败:", await response.text());
    }
  } catch (error) {
    console.error("Bark 请求发生网络错误:", error);
  }
}
