// Fetch url from server
// async function fetchUri() {
//     await fetch('/getUri')
//         .then(response => response.json())
//         .then(result => {return result.ip})
//         .catch(err => console.log(err))
// }

// Sends nickname to server and saves to database
async function postData(data = {}) {
    // Default options are marked with *
    try {
        print
        const response = await fetch('/savingNickname', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response; // parses JSON response into native JavaScript objects
    } catch(err) {
        return err;
    }
}

// Sends UuID and new nickname to server and update entity with new nickname
async function updateData(data = {}) {
    // Default options are marked with *
    try {
        const response = await fetch('/updateNickname', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response
    } catch(err) {
        return err;
    }
}

export{
    // fetchUri,
    postData,
    updateData
}