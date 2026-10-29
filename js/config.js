export const SPREADSHEET_ID = "1XKAcbRIgjeKUOyioq0TdtnAs8SJDAXgPKhuA58AwJc4";
export let webAppUrl = localStorage.getItem('monopoly_webapp_url') || '';

export function setWebAppUrl(url) {
    webAppUrl = url;
    localStorage.setItem('monopoly_webapp_url', url);
}
