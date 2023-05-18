const {
    createUser,
    getUser,
    createConstraintIfNotExists,
} = require("./data/users");
const {
    createPost,
    getPostByID,
    getPostsByUser,
    getPostsOfFollowedUsers,
} = require("./data/post");
const {
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    getPostLikes,
    getCommentLikes,
} = require("./data/like");
const {
    createCommentToPost,
    createCommentToComment,
    getCommentsByPost,
    getPostCommentsCount,
} = require("./data/comment");
const {
    followUser,
    unfollowUser,
    getFollowedByUser,
    getFollowingUsers,
    getUserFollowersCount,
    getUserFollowedCount,
} = require("./data/follow");
const { searchByPhrase, createIndexIfNotExists } = require("./data/search");
const { recommendationForUser } = require("./data/recommendation");
const { client } = require("./lib/redis");

const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        preflightContinue: true,
        credentials: true,
    })
);
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
    session({
        store: new RedisStore({ client: client }),
        secret: "neo4j jest super",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 8 * 60 * 60 * 1000 },
    })
);
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const likesRouter = require("./routes/likes");
const commentsRouter = require("./routes/comments");
const followersRouter = require("./routes/followers");
const postsRouter = require("./routes/posts");
const recommendationRouter = require("./routes/recommendation");
const searchRouter = require("./routes/search");

// zabezpieczenie przed niezalogowanymi
app.use("*", (req, res, next) => {
    if (!req.user && req.originalUrl.indexOf("/auth") === -1) {
        res.sendStatus(401);
        return;
    }
    next();
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/likes", likesRouter);
app.use("/comments", commentsRouter);
app.use("/followers", followersRouter);
app.use("/posts", postsRouter);
app.use("/recommendation", recommendationRouter);
app.use("/search", searchRouter);

app.get("/", async (req, res) => {
    // await createUser("kasia", "bbb")
    // await createUser("mateusz", "aaa")
    // await createUser("żaneta", "xxx")
    // await createUser("bartek", "yyy")
    // await createUser("oliwia", "zzz")
    // await createPost("Cześć wszystkim! Jestem Kasia i bardzo się cieszę, że mogę być z Wami na tej nowej platformie społecznościowej. Mam nadzieję, że będziemy mieli okazję lepiej się poznać i dzielić swoimi pasjami. Ja osobiście uwielbiam gotować, czytać książki i uprawiać jogę. A Wy? Co lubicie robić w wolnym czasie? Chętnie poznam Wasze zainteresowania i doświadczenia. Pozdrawiam serdecznie!", "kasia")
    // await createPost("Cześć wszystkim! Jestem Mateusz i bardzo się cieszę, że dołączyłem do tej wspaniałej społeczności. Mam nadzieję, że będę miał okazję poznać wiele ciekawych ludzi i nauczyć się czegoś nowego. Jestem wielkim fanem sportów, szczególnie piłki nożnej i koszykówki. Lubię także podróżować i poznawać nowe kultury. W moim wolnym czasie lubię też pograć w gry komputerowe i czytać książki. Chętnie podzielę się swoimi doświadczeniami i pomysłami, a także posłucham o Waszych pasjach i zainteresowaniach. Mam nadzieję, że będziemy mieli wiele okazji do rozmów i wymiany myśli. Pozdrawiam serdecznie!", "mateusz")
    // await createPost("Witajcie! Tutaj Żaneta, a ja bardzo się cieszę, że dołączyłam do Was na tej nowej platformie społecznościowej. Jestem otwarta na nowe znajomości i ciekawe rozmowy, więc nie wahajcie się napisać do mnie i podzielić się swoimi pasjami i zainteresowaniami. Osobiście uwielbiam muzykę i taniec - to moja wielka pasja od dzieciństwa. Lubię też czytać książki, podróżować i poznawać nowe kultury. Bardzo lubię też gotować i próbować nowych smaków. Jestem tu, aby dzielić się swoimi doświadczeniami i nauczyć się czegoś nowego od Was. Mam nadzieję, że będziemy mieli okazję lepiej się poznać i porozmawiać o różnych tematach. Pozdrawiam serdecznie!", "żaneta")
    // await createPost("Cześć wszystkim! Witajcie na nowej platformie społecznościowej! Nazywam się Bartek i jestem zadowolony, że mogę być z Wami tutaj. Jestem bardzo zainteresowany poznawaniem nowych ludzi i dzieleniem się swoimi pasjami oraz doświadczeniami. Moje główne zainteresowania to sporty ekstremalne, fotografia i podróże. Lubię biegać po górach, nurkować w egzotycznych miejscach i robić zdjęcia, które oddają piękno świata. Chętnie będę rozmawiał z Wami na różne tematy i dzielił się swoimi historiami. Mam nadzieję, że będziemy mieli okazję lepiej się poznać i inspirować się nawzajem. Pozdrawiam serdecznie i do zobaczenia na platformie!", "bartek")
    // await createPost("Witajcie. Jestem Oliwia i dzielę się z Wami moim życiem, którego nie zawsze było łatwe. Od najmłodszych lat zmagałam się z chorobą, która mocno wpłynęła na moje życie. Zawsze miałam marzenia i ambicje, jednak moja choroba zmuszała mnie do rezygnacji z wielu z nich. Miałam wiele trudnych chwil, ale zawsze starałam się być silna i pozytywnie patrzeć w przyszłość. Dzięki temu, że jestem na tej platformie, mam nadzieję, że uda mi się spotkać osoby, które mają podobne doświadczenia i mogą mnie zainspirować. Będę również chętnie słuchać Waszych historii i doświadczeń. Życie nie zawsze jest łatwe, ale ważne jest, aby nigdy nie tracić nadziei i walczyć o swoje marzenia. Dziękuję, że mogłam się z Wami podzielić moją historią.","oliwia")
    // await createCommentToPost("Cześć Kasia! Chciałam Ci podziękować za Twój post i otwartość na nowe znajomości. Jestem Oliwia i z chęcią poznam ludzi o podobnych zainteresowaniach. Twoje pasje i zainteresowania brzmią bardzo interesująco, a ja również uwielbiam muzykę i taniec. Niestety, moja choroba mocno wpłynęła na moje życie i muszę uważać na swoje zdrowie. Jednak, jak powiedziałam wcześniej, ważne jest, aby nigdy nie tracić nadziei i walczyć o swoje marzenia. Możemy porozmawiać o muzyce i tańcu, a Ty możesz mnie zainspirować swoimi pomysłami i podejściem do życia. Dzięki tej platformie mamy szansę na poznanie ludzi o różnych doświadczeniach i zainteresowaniach, a to naprawdę cieszy i daje nadzieję na lepsze jutro. Dziękuję za Twój post i mam nadzieję, że niedługo się poznamy bliżej. Pozdrawiam serdecznie!", "oliwia", 5)
    // await createCommentToPost("Cześć Mateusz! Mam nadzieję, że dobrze się bawisz na nowej platformie społecznościowej. Widziałem Twój post o podróżach i muszę przyznać, że podziwiam Twoją odwagę i pasję do odkrywania świata. Ja również lubię podróżować i odkrywać nowe miejsca. Mój ulubiony sposób na spędzanie wolnego czasu to surfowanie, a najpiękniejsze miejsca, które miałem okazję zobaczyć, to plaże w Australii i Indonezji. Może kiedyś uda nam się wybrać razem na jakąś ekstremalną wyprawę? Z chęcią podzielę się moimi doświadczeniami i pomysłami na kolejne przygody. A Ty? Jesteś gotowy na nowe wyzwania? Pozdrawiam serdecznie i czekam na Twoją odpowiedź!", "bartek", 6)
    // await createCommentToPost("Cześć Mateusz! Bardzo miło mi przeczytać Twój post o podróżach. Ja również uwielbiam poznawać nowe kultury i odkrywać piękno naszego świata. Ostatnio miałam okazję odwiedzić Japonię i zakochałam się w tym kraju. Fascynująca kultura, wspaniałe jedzenie i piękne krajobrazy, to tylko niektóre z rzeczy, które zapadły mi w pamięć. Co myślisz o Japonii? Czy miałeś już okazję tam podróżować? Chętnie poznam Twoje ulubione miejsca i zabytki. Może wymienimy się wskazówkami i pomysłami na kolejne wyprawy? Pozdrawiam serdecznie i czekam na Twoją odpowiedź!", "żaneta", 6)
    // await createCommentToComment("Cześć Oliwia! Bardzo miło mi czytać Twoją odpowiedź na post Kasi. Twoja determinacja i pozytywne podejście do życia są naprawdę inspirujące. Chociaż Twoja choroba wpłynęła na Twoje życie, podziwiam Cię za to, że wciąż walczysz i nie tracisz nadziei. Muzyka i taniec to również moje pasje, więc mam nadzieję, że będziemy mogli porozmawiać o naszych ulubionych utworach i stylach tanecznych. Jednocześnie chciałbym Cię zaprosić na jakiś koncert lub festiwal muzyczny. To może być doskonała okazja, aby oderwać się od codzienności i zaczerpnąć nowych wrażeń. Co Ty na to? Czekam na Twoją odpowiedź i życzę Ci wszystkiego najlepszego!", "mateusz", 10)
    // await createCommentToComment("Cześć Mateusz! Dziękuję za Twoją odpowiedź na mój post. Cieszę się, że podzielasz moją pasję do muzyki i tańca. Oczywiście, chętnie porozmawiamy o naszych ulubionych utworach i stylach tanecznych. Mój ulubiony gatunek muzyki to pop i hip-hop, a co do tańca, to najbardziej interesuje mnie taniec nowoczesny i balet. Co do Twojego zaproszenia na koncert lub festiwal muzyczny, to brzmi świetnie! Jestem zainteresowana i nie mogę się doczekać, kiedy będziemy mogli przeżyć to razem. Czy możesz mi powiedzieć, jakie koncerty lub festiwale są na Twojej liście must-see? Pozdrawiam serdecznie i czekam na Twoją odpowiedź!", "oliwia", 13)
    // await followUser("bartek", "kasia")
    // await followUser("kasia", "bartek")
    // await followUser("bartek", "mateusz")
    // await followUser("mateusz", "bartek")
    // await followUser("żaneta", "mateusz")
    // await followUser("oliwia", "bartek")
    // await followUser("kasia", "oliwia")
    // await likePost("kasia", 7)
    // await likePost("oliwia", 6)
    // await likePost("bartek", 5)
    // await likePost("mateusz", 9)
    // await likePost("kasia", 8)
    // await likePost("mateusz", 8)
    // await likePost("żaneta", 6)
    // await likePost("oliwia", 7)
    // await likeComment("mateusz", 12)
    // await likeComment("żaneta", 11)
    // await likeComment("kasia", 13)
    // await likeComment("bartek", 12)

    // await createPost("TEST123", "kasia")
    // await createCommentToPost("TEST NA POSTA", "oliwia", 15)
    // await createCommentToComment("TEST NA KOMENT", "mateusz", 16)


    // const recom = await recommendationForUser('kasia')

    // await createCommentToComment("Test", "oliwia", 13)
    // rese= await getCommentsByPost(5)

    //await searchByPhrase('sport')

    // const post = await getFollowingUsers("xxx")
    // console.log(post)
    // const comment = await getCommentsByPost(4)
    // console.log(comment)

    res.send("rese");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    createIndexIfNotExists();
    createConstraintIfNotExists();
});

process.on("SIGTERM", async () => {
    await server.close();
});
