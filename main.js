"use strict";
///<reference path="jquery-3.5.1.js"/>

// initialization to json of currencies:
let currenciesJson;

const CURRENCIES_LIST = 0
const CURRENCY_INFO = 1
const CARDS_TO_DISPLAY = 255

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(function () {
    let currenciesArray = []
    const selectedCurrencies = []
    let isModalOpen = false
    let currentSearch = ''
    let hiddenCards = []
    // run on page load:
    // async function loadSomething() {

    //     const result = await getApiResponse("https://api.coingecko.com/api/v3/list"); //result can be json or array of objects
    //     //const result=  await getApiResult("https://api.coingecko.com/api/v3/coins/list","");
    //
    //     console.log(result);
    //     //do something with the result (for example, print the result on the screen)
    //
    // }
    //
    // loadSomething();

    // return;

    // Activating the function of LoadCurrencies:
    LoadCurrencies();

    // A function that will work when the page loads:
    async function LoadCurrencies() {

        // Displays the progress bar when the page loads:
        showProgressBar();

        //Get the currencies response (json) from the WEB API
        currenciesArray = await getApiResponse(CURRENCIES_LIST);

        //Run over the array of cards, and add card by card to the grid
        for (let i = 1; i < CARDS_TO_DISPLAY; i++) {
            addCardToGrid(currenciesArray[i], i);
        }

        hideProgressBar();
    }

    function getApiResponse(type, id) {
        let url;
        switch (type) {
            case CURRENCIES_LIST:
                url = "https://api.coingecko.com/api/v3/coins/list";
                break;
            case CURRENCY_INFO:
                url = "https://api.coingecko.com/api/v3/coins/" + id;
                break;
            default:
        }

        return $.ajax({
            url: url,
            type: 'GET',
            data: {
            },
            dataType: 'json',
        });
    }

    $("#deleteCookies").click(() => {
        function setCookie(name, value, expirydays) {
            // var d = new Date();
            // d.setTime(d.getTime() + (expirydays*24*60*60*1000));
            // var expires = "expires="+ d.toUTCString();
            document.cookie = name + "=" + value + "; ";
        }

        function deleteCookie(name){
            console.log('deleting cookie')
            setCookie(name,"",-1);
        }

        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++)
            deleteCookie(cookies[i].split("=")[0]);
    })

    $("#currenciesButton").click(() => {
        document.getElementById("aboutPage").style.display = 'none'
        document.getElementById("containerFluid").style.display = 'block'
    })

    $("#about").click(() => {
        document.getElementById("containerFluid").style.display = 'none'
        document.getElementById("aboutPage").style.display = 'flex'
        const AboutTextField = document.getElementById("aboutTextField")
        AboutTextField.style.display = 'flex'

        // let TextWrapper = document.createElement("div")
        // TextWrapper.className = 'textField'
        // TextWrapper += "Hi Hello"
        // TextWrapper += "</div>"
        // document.getElementById("aboutPage").append(TextWrapper)

    })

    $(".inputSearchCoin").change(event => {
        const input = event.target.value
        document.getElementById("notFound").display = 'none'
        hiddenCards.forEach(card => card.style.display = 'block')
        hiddenCards = []
        currentSearch = input

        const result = currenciesArray.filter(currency => !currency.id.includes(input))
        const divRow = document.getElementById("div_row")
        result.forEach(currency => {
            const cardToHide = document.getElementById(currency.id)
            // childToDelete && childToDelete.style.display = 'none'
            if (cardToHide) {
                hiddenCards.push(cardToHide)
                cardToHide.style.display = 'none'
                // divRow.removeChild(childToDelete)
            }
        })

        if (hiddenCards.length === CARDS_TO_DISPLAY) {
            console.log('true')
            document.getElementById("notFound").style.display = 'block'
        } else {
            console.log(hiddenCards.length)
            console.log(currenciesArray.length)
            console.log(false)
        }
        // search logic here
        // this function will be executed on click of X (clear button)
    });
    //     // try+ catch to checking if the search success or failed by user:
    //     try {
    //         $("#mainDiv").empty();
    //         const nameOfCurrency = $(".inputSearchCoin").val();
    //         const urlSearchCurrency = "https://api.coingecko.com/api/v3/coins/list${nameOfCurrency}";
    //
    //         const dataCurrency = await showCurrency(urlSearchCurrency);
    //         getArrayOfCurrencies(dataCurrency);
    //     }
    //     catch (err) {
    //         alert("The currency you search doesn't find");
    //     }
    // });

    // function to dynamic appearance of the cards with the information on the currencies:
    function addCardToGrid(currency = {}, index) {
        // console.log('currency.id: ', currency.id)
        // if (!currency.id.includes('01coin')) {
        //     return
        // }
        // console.log('currency: ', currency)
        // const buttonId = 'moreInfo' + index
        //append new card to the second row:
        const div = document.createElement("div")
        div.className = "col-sm-4"
        div.id = currency.id

        const cardDiv = document.createElement("div")
        cardDiv.className = "card"
        cardDiv.id = "card" + index

        // const CardHeader = document.createElement("div")
        // CardHeader.className="cardHeader"
        //
        // cardDiv.append(CardHeader)
        $(div).append(cardDiv)

        // let imageSrc = ''

        let TextField = "<div id='textField" + index + "' class='textField'><div class='currency' id='priceUsd" + index +"'></div><div class='currency' id='priceEur" + index +"'></div><div class='currency' id='priceIls" + index +"'></div><div class='imageMoreInfoData'> <img class='img' id='img" + index + "' src=''>''</div><div id='description" + index + "'>Charging...</div></div>"
        // const DollarPrice =
        let CardDivString = " <div id=" + currency.id + " class='symbol'>Symbol:"+ currency.symbol + "</div>"
        let content = 'abcd'
        CardDivString += "<div class='cardInfo'>"
        // CardDivString += "<span class='currencyName'>" + "Name:" + " " + currency.name + "</span> <label class='switch'>  <input type='checkbox'> <span class='slider round'></span> </label>";
        CardDivString += "<span class='currencyName' id='currencyName" + index + "'>" + "Name:" + " " + currency.name + "</span>"
        CardDivString += "<label class='switch'> <input class='sliders' type='checkbox' id='slider" + index + "'>  <span class='slider round'></span> </label>"
        CardDivString += "<button class='btn btn-primary btn_card_more_info' type='button' id='moreInfo" + index + "'>More Info</button>"
        // CardDivString +="<div class='imageMoreInfoData'> <img id='img" + index + "' src=''>''</div>";
        // CardDivString += "<div class='currencyPrice' id='priceUsd" + index +"'>Charging...</div>";
        // CardDivString += "<div class='currencyPriceEur' id='priceEur" + index +"'></div>";
        // CardDivString += "<div class='currencyPriceILS' id='priceIls" + index +"'></div>";
        CardDivString += TextField
        // CardDivString += Modal


        CardDivString = CardDivString + "</div>"


        // append switch to card:
        $(cardDiv).append(CardDivString);
        $("#div_row").append(div);

        const openTextField = textField => {
            const description = document.getElementById("description" + index)
            // console.log('click')
            // console.log(textField)
            // const card = document.getElementById("card")
            cardDiv.style.height = "400px"
            textField.style.display = "flex"
            getApiResponse(CURRENCY_INFO, currency.id).then(response => {
                console.log(response)
                document.getElementById("img" + index).src = response.image.small
                document.getElementById("priceUsd" + index).innerHTML = response.market_data.current_price.usd + '$'
                document.getElementById("priceEur" + index).innerHTML = response.market_data.current_price.eur + '€'
                document.getElementById("priceIls" + index).innerHTML = response.market_data.current_price.ils + '₪'
                description.innerHTML = response.description['en']
                console.log('cookie')
                // console.log(JSON.stringify(response))
                console.log(currency.id + "=" + JSON.stringify(response))
                document.cookie = currency.id + "=" + JSON.stringify(response)
                console.log(document.cookie)
                // console.log(response.image.large)
            })}

        const closeTextField = textField => {
            textField.style.display = 'none'
            cardDiv.style.height = '160px'
        }

        $('#moreInfo' + index).click(function() {
            const cookie = document.cookie
            if (cookie === '') {
                console.log(true)
                const textField = document.getElementById("textField" + index);
                if (textField.style.display !== 'flex') {
                    openTextField(textField)
                } else {
                    closeTextField(textField)
                }
            } else {
                console.log('else')
                const stam = getCookie('0-5x-long-altcoin-index-token')
                console.log(stam)
                // document.cookie = "username=John Doe";
            }

            // document.cookie = "username=John Doe"
        })

            // clickedButton.style.height = "400px"


        $('#slider' + index).click(function() {
            const modal = document.getElementById("modal")
            if (isModalOpen) {
                // document.getElementsByClassName()
                return
            }

            const slider = document.getElementById("slider"+ index)
            if (slider.checked) {
                addCurrency()
            } else {
                deleteCurrency()
                // array.splice(index, 1)
            }
        });

        const deleteCurrency = (currentIndex = index) => {
            const currencyToDeleteIndex = selectedCurrencies.indexOf(currentIndex)
            selectedCurrencies.splice(currencyToDeleteIndex, 1)
        }

        const closeModal = (currencyToDelete = document.getElementById("currencyToDelete")) => {
            isModalOpen = false
            document.getElementById("modal").style.display = 'none'
            currencyToDelete.innerHTML = ''
            const sliders = document.getElementsByClassName("sliders")
            Object.keys(sliders).forEach(key => sliders[key].disabled = false)

        }

        const addCurrency = (currentIndex = index) => {
            if (selectedCurrencies.length < 1)
            {
                selectedCurrencies.push(index)
            } else {
                const modal = document.getElementById("modal")
                modal.style.display = 'block'
                isModalOpen = true
                const sliders = document.getElementsByClassName("sliders")
                Object.keys(sliders).forEach(key => sliders[key].disabled = true)
                const currencyToDelete = document.getElementById("currencyToDelete")
                let deleteCurrencies = "<div>"
                // let currenciesToDelete = ""
                selectedCurrencies.forEach(index => {
                    // document.getElementById("currencyName" + index)
                    // currenciesArray[index].name
                    deleteCurrencies = deleteCurrencies.concat("</div><button id='delete" + index + "'>delete</button> Currency Name: " + currenciesArray[index].name + "</div><br/>")
                })
                deleteCurrencies.concat("</div>")
                // document.getElementById("currencyToDelete").append("<div> <button>delete</button>Currency Name:</div>")
                // $(modal).append("<div class='currencyToDelete' id='currencyToDelete'><div> <button>delete</button> Currency Name:</div></div>")
                $(currencyToDelete).append(deleteCurrencies)
                selectedCurrencies.forEach(index => {
                    $("#delete" + index).click(() => {
                        deleteCurrency(index)
                        const slider = document.getElementById("slider" + index)
                        slider.checked = false
                        selectedCurrencies.push(currentIndex)
                        // $(currencyToDelete)
                        // currencyToDelete.children = undefined
                        closeModal(currencyToDelete)
                    })
                })

                document.getElementById("cancelButton").onclick = () => {
                    // deleteCurrency(index)
                    document.getElementById("slider" + index).checked = false
                    closeModal(currencyToDelete)
                }
            }
        }

        $("#crossIcon").click(() => {
            closeModal()
            document.getElementById("cancelButton").click()
        })
    }

    // function for displays progress bar when the page loads:
    function showProgressBar() {
        $("#loadingBar").show();
    }

    // function for hide the progress bar after the page is loaded:
    function hideProgressBar() {
        $("#loadingBar").hide();
    }
});

// --------------------------------------------------------------------------


{/* <div class="card">
<div class="symbol">BBB</div>
<div class="cardInfo">
    <span class="currencyName">Bitcoin</span>
    <label class="switch">
        <input type="checkbox">
        <span class="slider round"></span>
    </label>
    <br><br>
    <button class=" btn btn-primary btn_card_more_info" type="button">More Info</button>
</div>
</div> */}




// function getApiResult(urlApi, dataToSend) {
//     let url = urlApi + "/" + dataToSend;
//     return $.ajax({
//         url: url,
//         type: 'GET',
//         data: {},
//         dataType: 'json',
//     });
// }


// function getApiResultPost(urlApi, dataToSend) {
//     let url = urlApi + "/" + dataToSend;

//     return $.ajax({
//         url: url,
//         type: 'POST',
//         data: dataToSend,
//         dataType: 'json',
//     });
// }
