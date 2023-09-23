export default async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    return await fetch(url, options)
        .then(res => res.json())
        .then(data => data as T);
}