// import CardItem from "./CardItem";
import Card from "../Commun/Cards/product"
import { getProductsPagination } from "@/services/product.api";

const BestSellers = async () => {
  const productsWithPagination = await getProductsPagination(3);
  const products = productsWithPagination.data;
  // console.log(products);

  return (
    <div className="bg-brand-green py-8">
      <div className="flex w-full text-white text-2xl">
        <div className="flex-1 w-full border-t-2 translate-y-1/2  border-slate-400 opacity-50"></div>
        <h3 className="text-center uppercase px-4 font-bold pb-8 select-none ">
          nos best sellers
        </h3>
        <div className="flex-1 w-full border-t-2 translate-y-1/2  border-slate-400 opacity-50"></div>
      </div>

      {/* partie des cards  */}
      {/* <div className="px-4 ">
        {products.length === 0 ? (
          <p className="text-white text-center opacity-70">
            Les best sellers ne sont pas disponibles pour le moment.
          </p>
        ) : (
          <ul className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsWithPagination.data.slice(0, 3).map((el) => (
              <CardItem
                key={el.id}
                avalaible={el.available}
                slug={el.slug}
                id={el.id}
                name={el.name}
                price={el.price}
                carbon={el.carbon}
                scientific_name={el.scientific_name}
                image_urls={el.image_paths}
                variant={"simple"}
              />
            ))}
          </ul>
        )}
      </div> */}

      <div className="px-4 ">
        {products.length === 0 ? (
          <p className="text-white text-center opacity-70">
            Les best sellers ne sont pas disponibles pour le moment.
          </p>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsWithPagination.data.slice(0, 3).map((el) => (
              <Card
                key={el.id}
                avalaible={el.available}
                best_seller={el.best_seller}
                description={el.description}
                slug={el.slug}
                id={el.id}
                name={el.name}
                price={el.price}
                carbon={el.carbon}
                scientific_name={el.scientific_name}
                image_paths={el.image_paths}
                variant={"simple"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
