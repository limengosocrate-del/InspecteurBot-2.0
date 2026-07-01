/*=================================================
 INSPECTEURBOT RDC 2026
 DASHBOARD PREMIUM
 PARTIE 1
 RESET + VARIABLES + LAYOUT + SIDEBAR
==================================================*/


/*==============================
 VARIABLES
==============================*/

:root{

    --bleu-fonce:#041c5c;
    --bleu:#0b52d6;
    --bleu-clair:#0077c8;
    --or:#FFD700;
    --blanc:#ffffff;
    --gris:#edf2f9;
    --rouge:#ce1126;
    --vert:#1eaa4b;

    --shadow:
    0 15px 40px rgba(0,0,0,.12);

    --transition:.35s ease;

}


/*==============================
 RESET
==============================*/

*{

    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Poppins',sans-serif;

}


html{

    scroll-behavior:smooth;

}


body{

    background:
    linear-gradient(
        135deg,
        #edf2f9,
        #dbe7ff
    );

    color:#142c7a;

    overflow-x:hidden;

    line-height:1.6;

}


img{

    max-width:100%;
    display:block;

}


button{

    cursor:pointer;
    border:none;
    font-family:inherit;

}


a{

    text-decoration:none;

}



/*==============================
 SCROLLBAR
==============================*/


::-webkit-scrollbar{

    width:10px;

}


::-webkit-scrollbar-track{

    background:#041c5c;

}


::-webkit-scrollbar-thumb{

    background:var(--or);

    border-radius:30px;

}



/*==============================
 LAYOUT GENERAL
==============================*/


.dashboard-layout{

    display:flex;

    min-height:100vh;

}



/*==============================
 SIDEBAR PREMIUM
==============================*/


.sidebar{

    width:270px;

    height:100vh;

    position:fixed;

    left:0;

    top:0;

    background:

    linear-gradient(
        180deg,
        #041c5c,
        #08296d
    );


    color:white;

    padding:25px 18px;

    overflow-y:auto;

    z-index:1000;


    box-shadow:

    8px 0 30px rgba(0,0,0,.18);


    transition:var(--transition);

}



/* Effet lumineux */


.sidebar::before{

    content:"";

    position:absolute;

    top:-100px;

    right:-100px;

    width:250px;

    height:250px;

    background:

    radial-gradient(
        circle,
        rgba(255,215,0,.25),
        transparent 70%
    );


}



/* Logo */


.sidebar-logo{

    text-align:center;

    margin-bottom:40px;

    position:relative;

    z-index:2;

}



.sidebar-logo img{

    width:90px;

    height:90px;

    object-fit:contain;

    margin:auto;

    filter:

    drop-shadow(
        0 0 15px rgba(255,215,0,.7)
    );

    transition:.4s;

}



.sidebar-logo img:hover{

    transform:

    scale(1.15)
    rotate(8deg);

}



.sidebar-logo h3{

    margin-top:12px;

    font-size:19px;

    color:var(--or);

    font-weight:700;

}



.sidebar-logo p{

    font-size:13px;

    color:#dbe8ff;

}



/* Menu */


.sidebar ul{

    list-style:none;

    position:relative;

    z-index:2;

}



.sidebar ul li{

    margin-bottom:12px;

}



.sidebar ul li a{

    display:flex;

    align-items:center;

    gap:15px;


    padding:15px;

    color:white;

    border-radius:15px;


    font-size:15px;

    transition:var(--transition);

}



.sidebar ul li a i{

    width:25px;

    font-size:20px;

    color:var(--or);

}



.sidebar ul li a:hover,


.sidebar ul li.active a{


    background:

    linear-gradient(
        135deg,
        #0b52d6,
        #06245e
    );


    transform:

    translateX(8px);


    box-shadow:

    0 8px 25px rgba(0,0,0,.25);


}



/* Déconnexion */


.logout{

    margin-top:40px;

}



.logout a{


    display:flex;

    justify-content:center;

    align-items:center;

    gap:12px;


    padding:16px;


    border-radius:15px;


    background:

    linear-gradient(
        135deg,
        #ce1126,
        #9d0c1c
    );


    color:white;

    font-weight:700;


    transition:.35s;

}



.logout a:hover{


    transform:

    translateY(-5px);


    box-shadow:

    0 10px 25px rgba(206,17,38,.45);


}



/*==============================
 CONTENU PRINCIPAL
==============================*/


.main-content{


    flex:1;


    margin-left:270px;


    padding:30px;


    animation:

    fadeDashboard .7s ease;


}



@keyframes fadeDashboard{


from{

    opacity:0;

    transform:translateY(25px);

}


to{

    opacity:1;

    transform:translateY(0);

}


}


/*=================================================
 INSPECTEURBOT RDC 2026
 DASHBOARD PREMIUM
 PARTIE 2
 BANNER + STATISTIQUES + ACCÈS RAPIDE
==================================================*/


/*==============================
 BANNER PROFESSIONNEL
==============================*/


.banner{

    position:relative;

    height:260px;

    border-radius:30px;

    overflow:hidden;

    margin-bottom:35px;


    box-shadow:

    0 20px 45px rgba(0,0,0,.18);


}



.banner-image{

    width:100%;

    height:100%;

    object-fit:cover;


    transition:.6s;

}



.banner:hover .banner-image{

    transform:scale(1.05);

}



.banner-overlay{


    position:absolute;

    inset:0;


    background:

    linear-gradient(
        90deg,
        rgba(4,28,92,.85),
        rgba(4,28,92,.45)
    );


}



.banner-content{


    position:absolute;

    inset:0;


    display:flex;

    justify-content:space-between;

    align-items:center;


    padding:40px;


    color:white;


}



/* Partie gauche */


.banner-left{


    display:flex;

    align-items:center;

    gap:25px;


}



.banner-left img{


    width:100px;

    height:100px;


    background:white;


    padding:8px;


    border-radius:50%;


    box-shadow:

    0 0 25px rgba(255,215,0,.6);


}



.banner-left h1{


    font-size:45px;

    color:#fff;


    text-shadow:

    0 5px 20px rgba(0,0,0,.4);


}



.banner-left h3{


    color:var(--or);

    font-size:22px;


}



.banner-left p{


    max-width:650px;

    color:#e8f1ff;


}



/* Partie droite */


.banner-right{


    display:flex;

    flex-direction:column;

    gap:15px;


}



.top-box{


    display:flex;

    align-items:center;

    gap:12px;


    padding:18px 22px;


    border-radius:18px;


    background:

    rgba(255,255,255,.15);


    backdrop-filter:

    blur(15px);


    border:

    1px solid rgba(255,255,255,.2);


    color:white;


    animation:

    floatingBox 3s infinite;


}



@keyframes floatingBox{


0%,100%{

transform:translateY(0);

}


50%{

transform:translateY(-5px);

}


}



.top-box i{

    color:var(--or);

    font-size:22px;

}



/*==============================
 TITRES SECTIONS
==============================*/


.dashboard-section h2,

.quick-section h2{


    color:#142c7a;

    font-size:30px;

    margin-bottom:30px;


}



/*==============================
 CARTES STATISTIQUES
==============================*/


.stats-grid{


    display:grid;


    grid-template-columns:

    repeat(
        auto-fit,
        minmax(240px,1fr)
    );


    gap:25px;


}



.card{


    background:white;


    border-radius:25px;


    padding:28px;


    display:flex;

    align-items:center;

    gap:22px;


    box-shadow:

    var(--shadow);


    position:relative;


    overflow:hidden;


    transition:.4s;


}



.card::before{


    content:"";


    position:absolute;


    width:120px;

    height:120px;


    right:-40px;

    top:-40px;


    background:

    rgba(255,215,0,.15);


    border-radius:50%;


}



.card:hover{


    transform:

    translateY(-10px);


    box-shadow:

    0 20px 45px rgba(0,0,0,.20);


}



.card i{


    width:80px;

    height:80px;


    border-radius:22px;


    display:flex;

    justify-content:center;

    align-items:center;


    color:white;


    font-size:32px;


}



.card h3{


    font-size:18px;

    margin-bottom:8px;


    color:#333;


}



.card h1{


    font-size:36px;


    color:#142c7a;


}



.card p{


    color:#777;

}



/* Couleurs cartes */


.blue{

    background:

    linear-gradient(
        135deg,
        #0b52d6,
        #06245e
    );

}



.green{

    background:

    linear-gradient(
        135deg,
        #1eaa4b,
        #08752d
    );

}



.orange{

    background:

    linear-gradient(
        135deg,
        #ff9800,
        #e65100
    );

}



.purple{

    background:

    linear-gradient(
        135deg,
        #673ab7,
        #311b92
    );

}



.cyan{

    background:

    linear-gradient(
        135deg,
        #00acc1,
        #006064
    );

}



.dark{

    background:

    linear-gradient(
        135deg,
        #08296d,
        #041c5c
    );

}



/*==============================
 ACCÈS RAPIDE INSPECTION
==============================*/


.quick-section{


    margin-top:45px;


}



.quick-grid{


    display:grid;


    grid-template-columns:

    repeat(
        auto-fit,
        minmax(280px,1fr)
    );


    gap:25px;


}



.quick-card{


    background:white;


    padding:32px;


    border-radius:25px;


    box-shadow:

    var(--shadow);


    transition:.4s;


}



.quick-card:hover{


    transform:

    translateY(-10px);


}



.quick-card i{


    font-size:45px;


    color:var(--bleu);


    margin-bottom:20px;


}



.quick-card h3{


    color:#142c7a;

    font-size:22px;


    margin-bottom:15px;


}



.quick-card p{


    color:#666;

    line-height:1.8;


    margin-bottom:25px;


}



.quick-card button{


    padding:14px 30px;


    border-radius:15px;


    background:

    linear-gradient(
        135deg,
        #0b52d6,
        #06245e
    );


    color:white;


    font-weight:700;


    transition:.35s;


}



.quick-card button:hover{


    background:

    linear-gradient(
        135deg,
        #FFD700,
        #ffb300
    );


    color:#041c5c;


    transform:

    translateY(-5px);


}


/*=================================================
 INSPECTEURBOT RDC 2026
 DASHBOARD PREMIUM
 PARTIE 3
 GRAPHIQUES + INSPECTIONS + IA
==================================================*/


/*==============================
 GRAPHIQUES STATISTIQUES
==============================*/


.charts-section{


    display:grid;


    grid-template-columns:

    repeat(
        auto-fit,
        minmax(420px,1fr)
    );


    gap:30px;


    margin-top:45px;


}



.chart-box{


    background:white;


    padding:30px;


    border-radius:25px;


    box-shadow:

    var(--shadow);


    transition:.4s;


}



.chart-box:hover{


    transform:

    translateY(-8px);


}



.chart-box h3{


    color:#142c7a;


    font-size:22px;


    margin-bottom:25px;


}



.chart-box canvas{


    width:100%!important;


    height:320px!important;


}



/*==============================
 LISTE DES INSPECTIONS
==============================*/


.inspection-list{


    margin-top:45px;


    background:white;


    padding:30px;


    border-radius:25px;


    box-shadow:

    var(--shadow);


}



.inspection-list h3{


    color:#142c7a;


    font-size:24px;


    margin-bottom:25px;


}



.inspection-list table{


    width:100%;


    border-collapse:collapse;


}



.inspection-list th{


    background:#041c5c;


    color:white;


    padding:15px;


    text-align:left;


}



.inspection-list td{


    padding:18px;


    border-bottom:

    1px solid #eee;


}



.inspection-list tr:hover{


    background:#f5f8ff;


}



/* Statuts */


.success{


    background:#dff5e7;


    color:#178644;


    padding:8px 18px;


    border-radius:30px;


    font-weight:600;


}



.warning{


    background:#fff0d8;


    color:#d18200;


    padding:8px 18px;


    border-radius:30px;


    font-weight:600;


}



.danger{


    background:#ffe2e2;


    color:#cf2222;


    padding:8px 18px;


    border-radius:30px;


    font-weight:600;


}



/*==============================
 MODULES INTELLIGENCE ARTIFICIELLE
==============================*/


.ai-dashboard{


    margin-top:50px;


    display:grid;


    grid-template-columns:

    repeat(
        auto-fit,
        minmax(280px,1fr)
    );


    gap:25px;


}



.ai-card{


    padding:30px;


    border-radius:25px;


    color:white;


    background:

    linear-gradient(
        145deg,
        #041c5c,
        #08296d
    );


    box-shadow:


    0 15px 35px rgba(0,0,0,.20);


    transition:.4s;


    border:

    1px solid rgba(255,215,0,.25);


}



.ai-card:hover{


    transform:

    translateY(-10px);


    box-shadow:


    0 20px 45px rgba(0,0,0,.35);


}



.ai-card i{


    font-size:45px;


    color:#FFD700;


    margin-bottom:20px;


}



.ai-card h3{


    color:#FFD700;


    font-size:22px;


    margin-bottom:15px;


}



.ai-card p{


    color:#dbe8ff;


    line-height:1.7;


}



/* Bouton IA */


.ai-card button{


    margin-top:20px;


    padding:13px 25px;


    border-radius:15px;


    background:#FFD700;


    color:#041c5c;


    font-weight:700;


    transition:.35s;


}



.ai-card button:hover{


    transform:

    scale(1.05);


    box-shadow:


    0 0 20px #FFD700;


}



/*==============================
 RAPPORT JURIDIQUE IA
==============================*/


.rapport-preview{


    margin-top:45px;


    padding:35px;


    background:


    linear-gradient(
        145deg,
        #041c5c,
        #08296d
    );


    border-radius:30px;


    color:white;


    border:

    1px solid rgba(255,215,0,.25);


    box-shadow:


    0 20px 45px rgba(0,0,0,.25);


}



.rapport-preview h2{


    text-align:center;


    color:#FFD700;


    margin-bottom:25px;


}



.rapport-preview .article-reference{


    padding:20px;


    background:

    rgba(255,255,255,.08);


    border-left:

    5px solid #FFD700;


    border-radius:15px;


    margin-bottom:20px;


}



.article-reference strong{


    color:#FFD700;


}



/*==============================
 FOOTER DASHBOARD
==============================*/


.footer{


    margin-top:50px;


    padding:35px;


    text-align:center;


    background:#041c5c;


    color:white;


    border-radius:30px 30px 0 0;


}



.footer img{


    width:85px;


    margin:auto;


    margin-bottom:15px;


}



.footer h3{


    color:#FFD700;


    margin-bottom:10px;


}



/*==============================
 BOUTON RETOUR HAUT
==============================*/


#btnTop{


    position:fixed;


    right:25px;


    bottom:25px;


    width:60px;


    height:60px;


    border-radius:50%;


    background:#FFD700;


    color:#041c5c;


    display:flex;


    align-items:center;


    justify-content:center;


    font-size:24px;


    z-index:999;


    box-shadow:


    0 10px 25px rgba(0,0,0,.25);


    transition:.35s;


}



#btnTop:hover{


    transform:

    translateY(-8px);


    box-shadow:


    0 0 25px #FFD700;


 }

/*=================================================
 INSPECTEURBOT RDC 2026
 DASHBOARD PREMIUM
 PARTIE 4
 RESPONSIVE + LOGIN + IMPRESSION
==================================================*/


/*==============================
 TABLETTES
==============================*/


@media(max-width:1100px){


    .sidebar{

        width:230px;

    }


    .main-content{

        margin-left:230px;

        padding:20px;

    }


    .banner-left h1{

        font-size:35px;

    }


    .banner-content{

        padding:25px;

    }


}



/*==============================
 MOBILE
==============================*/


@media(max-width:768px){



    .dashboard-layout{


        flex-direction:column;


    }



    .sidebar{


        width:100%;


        height:auto;


        position:relative;


        border-radius:0 0 25px 25px;


    }



    .main-content{


        margin-left:0;


        padding:15px;


    }



    .sidebar-logo{


        margin-bottom:20px;


    }



    .banner{


        height:auto;


        min-height:520px;


    }



    .banner-content{


        flex-direction:column;


        justify-content:center;


        text-align:center;


        gap:25px;


    }



    .banner-left{


        flex-direction:column;


    }



    .banner-left h1{


        font-size:28px;


    }



    .banner-left p{


        font-size:14px;


    }



    .banner-right{


        width:100%;


    }



    .top-box{


        justify-content:center;


    }



    .stats-grid,


    .quick-grid,


    .ai-dashboard,


    .charts-section{


        grid-template-columns:1fr;


    }



    .card{


        padding:20px;


    }



    .chart-box canvas{


        height:250px!important;


    }



    .inspection-list{


        overflow-x:auto;


    }



    .inspection-list table{


        min-width:650px;


    }



    .ai-card,


    .rapport-preview{


        padding:22px;


    }



    #btnTop{


        width:50px;


        height:50px;


        right:15px;


        bottom:15px;


    }


}



/*==============================
 PETITS SMARTPHONES
==============================*/


@media(max-width:480px){



    .main-content{


        padding:10px;


    }



    .banner-left img{


        width:75px;


        height:75px;


    }



    .banner-left h1{


        font-size:23px;


    }



    .dashboard-section h2,


    .quick-section h2{


        font-size:24px;


    }



    .card{


        flex-direction:column;


        text-align:center;


    }



    .card i{


        width:65px;


        height:65px;


    }



    .quick-card{


        padding:22px;


    }



}



/*=================================================
 ACCUEIL - LOGIN - REGISTER
==================================================*/


.top-navbar{


    background:#041c5c;


    padding:15px 40px;


    display:flex;


    justify-content:space-between;


    align-items:center;


    color:white;


}



.nav-logo{


    display:flex;


    align-items:center;


    gap:15px;


}



.nav-logo img{


    width:60px;


}



.nav-logo h2{


    color:#FFD700;


}



.top-navbar a{


    color:white;


    transition:.3s;


}



.top-navbar a:hover{


    color:#FFD700;


}



/* HERO */


.hero{


    min-height:90vh;


    position:relative;


    display:flex;


    align-items:center;


    justify-content:center;


}



.hero-image{


    position:absolute;


    inset:0;


    width:100%;


    height:100%;


    object-fit:cover;


}



.hero-overlay{


    position:absolute;


    inset:0;


    background:rgba(4,28,92,.65);


}



.hero-content{


    position:relative;


    z-index:2;


    text-align:center;


    color:white;


    padding:30px;


}



.hero-content h1{


    font-size:50px;


    color:#FFD700;


}



.hero-content h3{


    margin:20px;


}



.btn-start{


    display:inline-flex;


    align-items:center;


    gap:10px;


    padding:15px 35px;


    border-radius:15px;


    background:#0b52d6;


    color:white;


    font-weight:700;


    transition:.35s;


}



.btn-start:hover{


    background:#FFD700;


    color:#041c5c;


    transform:translateY(-5px);


}



/*==============================
 FORMULAIRES
==============================*/


.auth-box{


    max-width:450px;


    margin:50px auto;


    background:white;


    padding:35px;


    border-radius:25px;


    box-shadow:var(--shadow);


}



.auth-box h2{


    text-align:center;


    color:#142c7a;


    margin-bottom:25px;


}



form input{


    width:100%;


    padding:15px;


    border-radius:12px;


    border:1px solid #ddd;


    margin-bottom:15px;


}



form input:focus{


    border-color:#0b52d6;


    outline:none;


}



form button{


    width:100%;


    padding:15px;


    border-radius:12px;


    background:#0b52d6;


    color:white;


    font-weight:700;


}



form button:hover{


    background:#041c5c;


}



/*==============================
 IMPRESSION RAPPORTS
==============================*/


@media print{


    body{


        background:white!important;


        color:black!important;


    }



    .sidebar,


    .top-navbar,


    .banner,


    button,


    #btnTop{


        display:none!important;


    }



    .main-content{


        margin:0;


        padding:0;


    }



    .rapport-preview,


    .article-card,


    .inspection-list{


        background:white!important;


        color:black!important;


        box-shadow:none;


        border:1px solid #ccc;


    }



}


/*=================================================
 INSPECTEURBOT RDC 2026
 DASHBOARD PREMIUM
 PARTIE 5
 FINITIONS PREMIUM + IA + PERFORMANCE
==================================================*/


/*==============================
 ANIMATIONS GENERALES
==============================*/


.fade-in{

    animation:
    fadeInPremium .8s ease;

}



@keyframes fadeInPremium{


    from{

        opacity:0;

        transform:
        translateY(25px);

    }


    to{

        opacity:1;

        transform:
        translateY(0);

    }


}



/*==============================
 BADGES INSPECTION IA
==============================*/


.badge-ia{


    display:inline-flex;

    align-items:center;

    gap:10px;


    padding:10px 20px;


    border-radius:30px;


    background:

    rgba(255,215,0,.15);


    border:

    1px solid rgba(255,215,0,.4);


    color:#FFD700;


    font-weight:700;


}



.badge-ia::before{


    content:"🟢";


    animation:

    pulseIA 1.5s infinite;


}



@keyframes pulseIA{


    0%{

        transform:scale(.8);

        opacity:.5;

    }


    50%{

        transform:scale(1.2);

        opacity:1;

    }


    100%{

        transform:scale(.8);

        opacity:.5;

    }


}



/*==============================
 CARTES JURIDIQUES
==============================*/


.juridique-card{


    background:

    linear-gradient(
        145deg,
        #041c5c,
        #08296d
    );


    color:white;


    padding:30px;


    border-radius:25px;


    border:

    1px solid rgba(255,215,0,.25);


    box-shadow:

    0 15px 35px rgba(0,0,0,.25);


    transition:.4s;


}



.juridique-card:hover{


    transform:

    translateY(-8px);


    box-shadow:


    0 20px 45px rgba(0,0,0,.35);


}



.juridique-card h3{


    color:#FFD700;


    margin-bottom:15px;


}



.juridique-card .article-numero{


    display:inline-block;


    padding:8px 18px;


    border-radius:25px;


    background:#FFD700;


    color:#041c5c;


    font-weight:700;


    margin-bottom:15px;


}



/*==============================
 REPONSE RAG IA
==============================*/


.rag-response{


    margin-top:30px;


    padding:30px;


    background:white;


    border-radius:25px;


    border-left:


    6px solid #FFD700;


    box-shadow:


    0 15px 35px rgba(0,0,0,.12);


}



.rag-response h3{


    color:#142c7a;


    margin-bottom:20px;


}



.rag-response p{


    line-height:1.9;


    text-align:justify;


}



/*==============================
 NOTIFICATION SYSTEME
==============================*/


.notification-system{


    position:fixed;


    top:25px;


    right:25px;


    z-index:2000;


}



.notification-item{


    padding:18px 25px;


    border-radius:18px;


    background:#041c5c;


    color:white;


    margin-bottom:15px;


    box-shadow:


    0 10px 30px rgba(0,0,0,.25);


    border-left:


    5px solid #FFD700;


    animation:

    slideNotification .5s ease;


}



@keyframes slideNotification{


from{

    opacity:0;

    transform:translateX(50px);

}


to{

    opacity:1;

    transform:translateX(0);

}


}



/*==============================
 MODE SOMBRE APPLICATION
==============================*/


.dark-mode{


    background:#020617!important;

    color:white;


}



.dark-mode .card,


.dark-mode .quick-card,


.dark-mode .chart-box,


.dark-mode .inspection-list,


.dark-mode .auth-box{


    background:#111827;


    color:white;


}



.dark-mode h2,


.dark-mode h3{


    color:#FFD700;


}



/*==============================
 OPTIMISATION PERFORMANCE
==============================*/


.card,

.quick-card,

.chart-box,

.ai-card,

.juridique-card{


    will-change:transform;


}



*{


    -webkit-font-smoothing:antialiased;


    -moz-osx-font-smoothing:grayscale;


}



/*==============================
 SUPPORT TABLETTES PAYSAGE
==============================*/


@media

(min-width:769px)

and

(max-width:1200px)

and

(orientation:landscape){



.banner-content{


    gap:20px;


}



.banner-left h1{


    font-size:32px;


}



}



/*==============================
 SUPPORT ECRANS LARGE
==============================*/


@media(min-width:1600px){



.main-content{


    max-width:1600px;


}



.banner-left h1{


    font-size:55px;


}



.card h1{


    font-size:42px;


}



}

