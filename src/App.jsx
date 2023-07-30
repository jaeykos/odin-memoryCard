import React, { useState, useEffect, useRef } from "react"
import "./App.css"

class Img {
  constructor(id, url) {
    this.id = id
    this.url = url
    this.isClicked = false
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export default function Clock() {
  const [imgs, setImgs] = useState([])
  const [dispImgs, setDispImg] = useState([])
  const [numClicks, setNumClicks] = useState(0)
  const isReset = useRef(false)

  const apiKey = "yZcyBpV9em06sqEJUEktwXFeaG5s6l0M"
  let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&rating=g`
  console.log(url)

  function switchOrder() {
    const tempImgs = [...imgs]
    shuffleArray(tempImgs)
    setDispImg(tempImgs.slice(0, 6))
  }

  function makeClickedTrue(e) {
    const tempImgs = [...imgs]
    const tempItem = tempImgs.filter((item) => item.id == e.target.id)
    tempItem[0].isClicked = true
    console.log(tempItem)
    console.log(tempImgs)
    setImgs(tempImgs)
    console.log(imgs)
  }

  function checkIfAlreadyClicked(e) {
    const tempImgs = [...imgs]
    const tempItem = tempImgs.filter((item) => item.id == e.target.id)
    if (tempItem[0].isClicked == true) {
      alert("this is already clicked! Game restarting!")
      resetGame()
    }
  }

  function checkIfWin() {
    if (numClicks == 5) {
      alert("You Win!")
      resetGame()
    }
  }

  function resetGame() {
    setNumClicks(0)

    const tempImgs = [...imgs]
    for (let item of tempImgs) {
      item.isClicked = false
    }
    setImgs(tempImgs)
    isReset.current = true
  }

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const tempImgs = []
        for (let i = 0; i < 10; i++) {
          tempImgs.push(new Img(i, data.data[i].images.downsized.url))
        }
        setImgs(tempImgs)
        setDispImg(tempImgs.slice(0, 6))
      })
  }, [])

  return (
    <>
      <div className="flex flex-col  bg-slate-400">
        <h1 className=" text-6xl font-semibold p-2">Memory Card Game</h1>
        <p className=" mt-5 p-2 text-xl">
          Keep clicking but not the previously clicked one! You win once you
          reach 5 clicks!{" "}
        </p>
        <div className="mt-auto  text-3xl p-2">Score: {numClicks}/5 </div>
        <div className="containerDiv mb-auto bg-slate-600 p-10 gap-4 grid sm:grid-cols-3 grid-cols-2  items-center justify-items-center object-contain  ">
          {dispImgs.map((item) => {
            return (
              <img
                className="images mx-2 p-2 object-contain max-h-full"
                id={item.id}
                key={item.id}
                src={item.url}
                onClick={(e) => {
                  isReset.current = false
                  setNumClicks(numClicks + 1)
                  checkIfAlreadyClicked(e)
                  checkIfWin()
                  {
                    if (isReset.current == false) {
                      makeClickedTrue(e)
                    }
                  }
                  switchOrder()
                }}
              ></img>
            )
          })}
        </div>
      </div>
    </>
  )
}

export { Clock }
