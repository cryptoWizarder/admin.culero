import axios from "axios";
/**
 * Verify Github Account
 * @param {object} payload the payload
 * @returns {string} the token
 */

export const parseGithubLink = (url: string) => {
    const link = url.split('github.com/')[1];
    if (link.includes('/')) {
        return link.replace(/\//g, '');
    } else {
        return link;
    }
}

export const parseSocialLink = (url: string) => {
    let str;
    let splittedURL;
    if (url.endsWith('/')) {
        str = url.slice(0, -1);
    }
    else {
        str = url;
    }
    splittedURL = str.split('/');
    console.log(splittedURL[splittedURL.length - 1])
    return splittedURL[splittedURL.length - 1];
}

export const verifyGithub = async (url: string) => {
    return await axios.get(
        `https://api.github.com/users/${url}`,
        {
            headers: {
                Accept: 'application/json',
            },
        },
    );
};

export const verifyLinkedin = async (url: string) => {
    return await axios.get(
        'https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile',
        {
            params: {
                linkedin_url: url,
                include_skills: 'false'
            },
            headers: {
                'X-RapidAPI-Key': 'a4700a72c1mshe8c9f650a88e606p1522f6jsn878fd1070408',
                'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com'
            }
        },
    );
};