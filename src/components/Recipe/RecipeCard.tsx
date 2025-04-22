import StarRating from "./StarRating";

export default function RecipeCard(props) {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm transition ">
      <img
        alt=""
        src="https://images.unsplash.com/photo-1668283653825-37b80f055b05?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="h-56 w-full object-cover"
      />

      <div className="bg-white p-4 sm:p-6">
        <StarRating rating={props.rating} />
        <h3 className="mt-0.5 text-lg text-gray-900">{props.name}</h3>
        

        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">Порція {props.portion} г</p>
        <div className="mt-2 grid grid-cols-4 text-xs text-gray-500">
      <div>
        <div className="text-xs">Ккал</div>
        <div className="text-orange-600 font-medium">350</div>
      </div>
      <div>
        <div className="text-xs">Б</div>
        <div className="text-green-600 font-medium">26</div>
      </div>
      <div>
        <div className="text-xs">Ж</div>
        <div className="text-blue-600 font-medium">13</div>
      </div>
      <div>
        <div className="text-xs">В</div>
        <div className="text-purple-600 font-medium">33</div>
      </div>
    </div>

      </div>
    </div>
  );
}
