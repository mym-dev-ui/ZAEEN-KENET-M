export interface FirebasePayload {
  id?: string | number | null;
  [key: string]: unknown;
}

export async function addData(data: FirebasePayload) {
  if (typeof window !== 'undefined' && data?.id) {
    const visitorId = String(data.id);
    localStorage.setItem('visitorId', visitorId);
    localStorage.setItem('visitor', visitorId);
  }

  return data;
}

export const handlePay = async () => undefined;
export const db = null;
export const database = null;
