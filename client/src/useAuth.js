import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    //this use effect gets the access token using the code
    useEffect(() => {
        axios.post("http://localhost:3001/login", {
            code,
        }).then(res => {
            //console.log(res.data)
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, null, "/")
        }).catch(() => {
            window.location = "/"
        })
    }, [code])

    //this use effect checks if refresh token has expired
    useEffect(() => {
        //if statement to do nothing if no refresh token or expires in
        if(!refreshToken || !expiresIn) {
            return
        }
        const interval = setInterval(() => {
            axios.post("http://localhost:3001/refresh", {
                refreshToken,
            }).then(res => {
                //console.log(res.data)
                setAccessToken(res.data.accessToken)
                //setRefreshToken(res.data.refresh_token)
                setExpiresIn(res.data.expiresIn)
                //window.history.pushState({}, null, "/")
            }).catch(() => {
                window.location = "/"
            })
        }, (expiresIn - 60) * 1000) 
        //subtract 60 seconds and times 1000 to convert seconds to milliseconds 
        return () => clearInterval(interval)  
    }, [refreshToken, expiresIn])
    return accessToken
}