const imageLink = document.getElementById("imageLink");
const contents = document.getElementById("contents");

const createContent = (childElm, text, deletehash = null) => {
  if (childElm === "span") {
    const child = document.createElement(childElm);
    child.innerText = text;
    contents.appendChild(child);
    const br = document.createElement("br");
    contents.appendChild(br);
  }
  if (childElm === "deleteButton") {
    if (!deletehash) {
      console.error("deleteHashを入れてね");
      return;
    }
    const child = document.createElement("button");
    child.innerText = text;
    contents.appendChild(child);
    child.setAttribute("id", "deleteButton");
    child.addEventListener("click", () => {
      deleteOfImgur(deletehash);
    });
  }
};

const deleteOfImgur = (deletehash) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID {{your-Client-ID}}");

  let formdata = new FormData();

  let requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };

  fetch(`https://api.imgur.com/3/image/${deletehash}`, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result.status))
    .catch((error) => console.log("error", error));
};

const createUseUrlObject = (tag, url, text = "default sentence") => {
  if (!url) {
    console.error("urlを入れてね");
    return;
  }
  const child = document.createElement(tag);
  const elm = contents.appendChild(child);

  const br = document.createElement("br");
  contents.appendChild(br);

  if (tag === "img") {
    elm.setAttribute("src", url);
    elm.setAttribute("width", "50%");
  }
  if (tag === "a") {
    if (!text) console.error("aタグのテキストがないよ。");
    elm.innerText = text;
    elm.setAttribute("href", url);
    elm.setAttribute("_blank", "True");
  }
};

createContent("span", "Test1: Hello");
createContent("span", "Test2: World");
// createContent("deleteButton", "削除", "QJslN0I1Y3WskxY");
// let u = "https://i.imgur.com/zgK9mZD.jpg";
// createUseUrlObject("img", u);
// createUseUrlObject("a", u, "上記画像のURL");

const button = document.getElementById("postImg");
button.addEventListener("click", (e) => {
  console.log(imageLink.value);
  if (!imageLink.value) return;
  toImgur(imageLink.value);
});

const toImgur = (image) => {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", "Client-ID {{your-Client-ID}}");

  let formdata = new FormData();
  formdata.append("image", image);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };

  fetch("https://api.imgur.com/3/image", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let data = {
        status: result.status,
        imageLink: result.data.link,
        deleteLink: result.data.deletehash,
        uploadTime: new Date(result.data.datetime * 1000)
      };
      console.log(data);
      Object.keys(data).forEach((item) => {
        console.log(item);
        createContent("span", `${item}: ${data[item]}`);
      });
      createUseUrlObject("img", data.imageLink);
      createUseUrlObject("a", data.imageLink, "上記画像のURL");
      createContent("deleteButton", "削除する。", data.deleteLink);
    })
    .catch((error) => console.log("error", error));
};

let imageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png";

let imageUrl2 =
  "https://i.pinimg.com/236x/fe/bf/9c/febf9c2074f0d4b5748c21392e04f6ee.jpg";

// response from imgurAPI(POST).
// {"data":
//   {
//     "id":"ehQvozj",
//     "title":null,
//     "description":null,
//     "datetime":1648900589,
//     "type":"image\/png",
//     "animated":false,
//     "width":800,
//     "height":600,
//     "size":226933,
//     "views":0,
//     "bandwidth":0,
//     "vote":null,
//     "favorite":false,
//     "nsfw":null,
//     "section":null,
//     "account_url":null,
//     "account_id":0,
//     "is_ad":false,
//     "in_most_viral":false,
//     "has_sound":false,
//     "tags":[],"ad_type":0,
//     "ad_url":"",
//     "edited":"0",
//     "in_gallery":false,
//     "deletehash":"QJslN0I1Y3WskxY",
//     "name":"",
//     "link":"https:\/\/i.imgur.com\/ehQvozj.png"
//   },
//   "success":true,
//   "status":200}
