exports.handler = async function (event, context) {
    const { Octokit } = require("@octokit/rest");
    
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    try {
        // Получаем текущий файл
        const { data } = await octokit.repos.getContent({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: 'projects.json'
        });

        // Декодируем и парсим
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const projects = JSON.parse(content);

        // Добавляем новый проект
        const newProject = JSON.parse(event.body);
        projects.push(newProject);

        // Обновляем файл в GitHub
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: 'projects.json',
            message: 'Добавлен новый проект',
            content: Buffer.from(JSON.stringify(projects, null, 2)).toString('base64'),
            sha: data.sha
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ошибка добавления проекта' })
        };
    }
};
