import { PREFIX, put } from './common';

export async function sendNotification(data) {
  try {
    const url = `${PREFIX}/notification/multiple/add`;
    await put(url, data);
  } catch (error) {
    console.error('发送通知失败:', error);
    throw error;
  }
}
