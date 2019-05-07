# Projektin aihe

Sovelluksessa pystyy arvostelemaan elokuvia asteikolla 0-5 ja lisäämään elokuvia arvosteltaviksi. Sovellus vaatii käyttäjätunnuksen luomista ja sisäänkirjautumista arvostelujen ja elokuvien luontia varten.

Tämä projekti on tehty NodeJS kurssin lopputyöksi. Projektissa on käytetty erilaisia teknologioita kuten:
* Node.js
* Express
* MongoDB
* EJS

Käytin backendin esimerkkinä harjoitus 4:n tiedostoja ja muokkasin niitä omiin tarpeisiini. Kaikki muu on tehty oman kokemuksen pohjalta ja erilaisia tutoriaaleja tarvittaessa käyttäen, mutta mitään koodia ei ole suoraan kopioitu 

Tämä repository on kytkettynä Heroku-palveluun, joka ylläpitää sovellusta osoitteessa https://movie-rater-node.herokuapp.com/

### Sovelluksen konfiguraatio ja käyttöönotto

Sovellus käyttää tällä hetkellä MongoDB Atlas pilvitietokantaa tietojen tallentamiseen. Jos haluat käyttää omaa tietokantaasi, mene `/config/dbconnection.js`, ja vaihda url muuttujan merkkijono tietokantasi osoitteeksi
```
module.exports = {
    url: <tietokantasi_osoite>
}
```

Käynnistä sovellus ajamalla `node app.js`. Nyt voit aloittaa sovelluksen käyttämisen.

### Huomautuksia

Koska sovellus on julkisesti saatavilla ja ei-kaupallisessa käytössä, en ota minkäänlaista vastuuta sovelluksen sisällöstä. Asiaton sisältö poistetaan sitä mukaan, kun huomaan sitä ilmestyvän. Käytä sovellusta omalla vastuullasi.

Sovelluksessa on bugi, joka aiheuttaa express-session -muuttujan "vuotamisen" kaikille clienteille (Toinen käyttäjä saattaa saada toisen käyttäjän käyttäjänimen kun liikkuu sivujen välillä, näkyy vasemmassa yläkulmassa)
