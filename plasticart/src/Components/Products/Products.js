import "./Products.css";

function Products() {
  const products = [
    {
      image:
        "https://th.bing.com/th/id/OIP.lMTua8Ng9GvdDiWVNri1NAHaEJ?w=314&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      title: "Amazon Coupon",
      points: 750,
      discount: "Flat 10% Off",
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.lMTua8Ng9GvdDiWVNri1NAHaEJ?w=314&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      title: "Amazon Coupon",
      points: 1000,
      discount: "Flat 15% Off",
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.XWCpB2qWGgntHAsnyrZE2wHaEJ?w=304&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      title: "Dominos",
      points: 700,
      discount: "Flat 15% Off",
    },
    {
      image:
        "https://franchiseindia.s3.ap-south-1.amazonaws.com/uploads/news/fi/5d7a39c238a77.jpeg",
      title: "Urbanclap",
      points: 1000,
      discount: "Flat 12% Off",
    },
    {
      image:
        "https://st1.latestly.com/wp-content/uploads/2019/06/Swiggy-781x441.jpg",
      title: "Swiggy",
      points: 650,
      discount: "Flat 10% Off",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
      title: "Zomato",
      points: 650,
      discount: "Flat 25% Off",
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.MbeF7ksUWmA04QthQ27JDQAAAA?rs=1&pid=ImgDetMain",
      title: "McDonald's",
      points: 700,
      discount: "Flat 25% Off",
    },
    {
      image:
        "https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/658425145515155.629fb1db81a2d.png",
      title: "KFC",
      points: 750,
      discount: "Flat 10% Off",
    },
  ];

  return (
    <div className="products">
      {products.map((product, index) => (
        <div key={index} className="card">
          <img src={product.image} alt={product.title} />
          <div className="cardContent">
            <p>
              <b>{product.title}</b>
            </p>
            <p>
              <b>{product.points} points</b>
            </p>
            <p>
              <b>{product.discount}</b>
            </p>
            <button className="redeemButton">
              <b>Redeem</b>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
