fetch("blogs.json")
        .then((response) => response.json())
        .then((blogs) => {
          const blogCardsContainer = document.getElementById("blog-cards-container");

          blogs.forEach((blog) => {
            const blogCard = `
              <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
                <div class="card mx-auto" style="width: 18rem;">
                  <img src="..." class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${blog.blogheading}</h5>
                    <p class="card-text">${blog.blogText.substring(0, 100)}...</p>
                    <a href="/blog2/${blog.id}" class="btn btn-primary">Go to Blog</a>
                    </div>
                  </div>
                </div>
              `;
  
              blogCardsContainer.innerHTML += blogCard;
            });
          })
          .catch((error) => {
            console.error("Error reading blogs.json:", error);
          });