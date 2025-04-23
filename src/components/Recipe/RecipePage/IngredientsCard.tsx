const groupedIngredients = [
  {
    title: 'Hoagie roll of choice',
    items: ['sesame roll', 'homemade hoagie', 'bakery sub roll', 'bolillo'],
  },
  {
    title: 'Lean cold cuts (2 parts)',
    items: ['rosemary ham', 'cooked prosciutto', 'deli ham'],
  },
  {
    title: 'Fatty cold cuts (1 part)',
    items: ['salami', 'mortadella', 'soppressata', 'fennel soppressata', 'prosciutto'],
  },
];

export default function IngredientsCard() {

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <div className="flex border-b  bg-gray-50">
        <h2 className='flex-1 py-2 text-m text-center font-semibold border-b-2 border-black text-black'>Інгридієнти</h2>
      </div>

      <div className="p-4">
        {groupedIngredients.map((group) => (
          <div key={group.title} className="mb-4">
            <h3 className="font-semibold text-black text-sm">{group.title}</h3>
            <ul className="mt-1 text-sm text-gray-600 space-y-1 pl-2">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}