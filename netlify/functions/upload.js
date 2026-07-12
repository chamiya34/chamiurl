export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { filename, image } = JSON.parse(event.body);

    const GITHUB_TOKEN = process.env.GH_TOKEN; 
    const REPO_OWNER = process.env.GH_OWNER; 
    const REPO_NAME = process.env.GH_REPO;   

    // GitHub API එක හරහා uploads/ folder එක ඇතුළට file එක දමයි
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/uploads/${filename}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Uploader'
      },
      body: JSON.stringify({
        message: `Upload image: ${filename}`,
        content: image
      })
    });

    const data = await response.json();

    if (response.status === 201) {
      return {
        statusCode: 200,
        body: JSON.stringify({ path: `uploads/${filename}` })
      };
    } else {
      return { statusCode: response.status, body: JSON.stringify({ error: data.message }) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
