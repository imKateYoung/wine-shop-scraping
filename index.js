//install packages: express, cheerio, axios
//set up server
//selector:#page-87929 > div.columns-4.products.col_wrap_fourth.rh-flex-eq-height.column_woo > div
//#page-87929 > div.columns-4.products.col_wrap_fourth.rh-flex-eq-height.column_woo > div:nth-child(1)

const express = require('express')
const axios = require("axios")
const cheerio = require("cheerio")

async function getPrice(){
    try{
        const siteUrl = "https://www.wines.com/shop/"
        const {data} = await axios({
            method: "GET",
            url: siteUrl,
        })
        const $ = cheerio.load(data)
        const elementSelector = '#page-87929 > div.columns-4.products.col_wrap_fourth.rh-flex-eq-height.column_woo > div'
        
        const keys = [
            'cart',
            'product',
            'region',
        ]

        const productArr = []
        let base = 'https://www.wines.com/'

     

        $(elementSelector).each((parentIndex,parentElement) =>{
            let keyIndex = 0
            let productObj={}
            $(parentElement).children().each((childIndex,childElement) =>{
                let value = $(childElement).text().trim()
                //get product link
                $('.product > div > h3 > a', data).each(function () {
                    const link = base + $(this).attr('href')
                    //console.log(link)
                })
             

                if(keyIndex === 1){
                    value = (
                        $('h3:first-child',$(childElement).html()).text().trim()
                        )
                }

                if(value){
                    delete productObj.cart
                    productObj[keys[keyIndex]] = value
                    keyIndex++
                }
            })
            
            productArr.push(productObj)
            //console.log(productArr)
            
        })
        return productArr
    }
    catch(err){
        console.log(err)
    }
}


getPrice()



const app = express()


app.get('/', async(req,res) =>{
    try{
        const priceFeed = await getPrice()
        return res.status(200).json({
            result:priceFeed
        })
    }catch(err){
        console.log(err)
    }
})

const PORT = process.env.PORT || 5500
app.listen(() =>{
    console.log(`Listening to port${PORT}`)
})