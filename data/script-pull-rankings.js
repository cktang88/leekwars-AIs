
(async() => {
  let full = []
  let fparams = {
    headers: {
      "Authentication": "Bearer <INSERT TOKEN HERE>"
    }
  }
  let url = req => `https://leekwars.com/api/ranking/get-active/leek/talent/${req}`
//   for(let i=1; i<50;i++){
//   for(let i=50; i<100;i++){
  for(let i=150; i<200;i++){
  await fetch(url(i), fparams).then(res => res.json()).then(e => full.push(e))
    console.log(i)
  }
  console.log(full)
})()
