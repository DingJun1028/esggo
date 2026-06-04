export async function createContext({ req, }) {
    // 這裡未來可以擴充：從 Header 解析 JWT 或 Session
    return {
        user: null, // 暫時預設
        requestId: req.headers.get('x-request-id') || Math.random().toString(36),
    };
}
//# sourceMappingURL=context.js.map