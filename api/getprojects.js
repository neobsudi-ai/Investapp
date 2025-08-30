exports.handler = async function (event, context) {
    const { Octokit } = require("@octokit/rest");
    
    // Авторизация через токен
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    try {
        // Получаем содержимое файла projects.json
        const { data } = await octokit.repos.getContent({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: 'projects.json'
        });

        // Декодируем из base64
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const projects = JSON.parse(content);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projects)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ошибка загрузки проектов' })
        };
    }
};
