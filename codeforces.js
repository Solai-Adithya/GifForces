const URL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5`

fetch(URL, {method: "GET"})
   .then(res => res.json())