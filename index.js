addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
// /**
//  * Respond with hello worker text
//  * @param {Request} request
//  */
async function handleRequest(request) {
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  let json = await response.json()
  let res1 = await fetch(json.variants[0]);
  let res2 = await fetch(json.variants[1]);
  //var group = Math.random() < 0.5 ? 'var1' : 'var2'
  let final = undefined
  let group = undefined

  

  class ElementHandler {
    element(element){
      if (element.tagName === 'title'){
        if (group === 'var1'){
          element.setInnerContent("Edited Variant 1")
        }else{
          element.setInnerContent("Edited Variant 2")
        }
      }
      
      if (element.tagName === 'h1'){
        if (group === 'var1'){
          element.setInnerContent("Edited Variant 1 Title using HTMLRewitter")
        }else{
          element.setInnerContent("Edited for Variant 2 Title using HTMLRewitter")
        }
      }

      if (element.tagName === 'p'){
        if (group === 'var1'){
          element.setInnerContent("This description for variant one was edited by Akshay Gupta")
        }else{
          element.setInnerContent("This description for variant two was edited by Akshay Gupta")
        }
      }
      if (element.tagName === 'a'){
        element.setInnerContent("A web app created by me")
      }

    }
  }

  class AttributeRewriter {
    constructor(attributeName) {
      this.attributeName = attributeName
    }
   
    element(element) {
      const attribute = element.getAttribute(this.attributeName)
      if (attribute) {
        element.setAttribute(
          this.attributeName,
          attribute.replace('https://cloudflare.com', 'https://github.com/akshaygupta16/eventWebsite')
        )
      }
    }
  }

  const rewriter = new HTMLRewriter()
    .on('title', new ElementHandler())
    .on('h1#title', new ElementHandler())
    .on('p#description', new ElementHandler())
    .on('a#url', new ElementHandler())
    .on('a#url', new AttributeRewriter('href'));

  const cookie = request.headers.get('Cookie');
  if (cookie && cookie === 'var1'){
    final = res1
    final = new Response(final.body)
    
     // group = cookie
    // final = group === 'var1' ? res1 : res2
  } else if (cookie && cookie === 'var2'){
    final = res2
    final = new Response(final.body)
  } else {
    group = Math.random() < 0.5 ? 'var1' : 'var2'
    final = group === 'var1' ? res1 : res2
    final = new Response(final.body)
    final.headers.set('Cookie', group);
  }

  return rewriter.transform(final)
}

function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}

