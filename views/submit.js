// Client side unique ID - This could and probably should move to server with UUID
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

document.getElementById('submit').addEventListener('click', async () => {
  let postId = uuidv4()
  let inputElem = document.getElementById('imgfile')
  let file = inputElem.files[0]

  let blob = file.slice(0, file.size, 'image/jpeg')
  newFile = new File([blob], `${postId}_post.jpeg`, { type: 'image/jpeg' })

  let formData = new FormData()
  formData.append('imgfile', newFile)

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData,
  })
  if (res.status !== 200) {
    console.log('Error occurs!!')
  }
  loadPosts()
})

// display upload images
async function loadPosts() {
  const getRes = await fetch('/upload', { method: 'GET' })
  const temp = await getRes.json()
  const data = temp[0]
  console.log(data)
  console.log(data[0].bucket.id)

  for (i = 0; i < data.length; i++) {
    const newImg = document.createElement('img')
    const url = `https://storage.googleapis.com/${data[i].bucket.id}/${data[i].id}`
    console.log(url)
    newImg.setAttribute('src', url)
    newImg.setAttribute('width', 50)
    newImg.setAttribute('height', 50)
    document.getElementById('images').appendChild(newImg)
  }
}
