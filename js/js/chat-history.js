/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 chat-history.js
 Historique conversations IA
===================================================*/

"use strict";


function saveChatMessage(role,message){


    let history =
        Storage.get(
            "chatHistory"
        ) || [];



    history.push({

        role:role,

        message:message,

        date:new Date()

    });



    Storage.save(
        "chatHistory",
        history
    );


}



function getChatHistory(){


    return Storage.get(
        "chatHistory"
    ) || [];

}



/*==================================================
 AFFICHER HISTORIQUE
===================================================*/

function showChatHistory(){


    const history =
        getChatHistory();



    const box =
        document.createElement(
            "div"
        );


    box.className =
        "chat-history-box";



    box.innerHTML = `

<h2>
💬 Historique IA
</h2>


<button id="closeChatHistory">

Fermer

</button>


<hr>


${
history.length

?

history.map(item=>`

<p>

<b>${item.role}</b>

<br>

${item.message}

<br>

<small>
${new Date(item.date)
.toLocaleString()}
</small>

</p>

`).join("")

:

"<p>Aucune conversation</p>"

}


`;



    document.body.appendChild(
        box
    );



    document
    .getElementById(
        "closeChatHistory"
    )
    .onclick =
    ()=>{

        box.remove();

    };


}



/*==================================================
 NETTOYER HISTORIQUE
===================================================*/

function clearChatHistory(){


    Storage.remove(
        "chatHistory"
    );


    showMessage(
        "Historique supprimé",
        "success"
    );


}
