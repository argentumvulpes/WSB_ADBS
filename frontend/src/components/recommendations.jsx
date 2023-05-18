import useUserRecommendations from "../data/use-recommendation";

export default function UserRecommendations() {
  const { data, isLoading } = useUserRecommendations();

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <div className="font-semibold text-lg text-gray-500 mt-8">
        Twoje propozycje znajomych:{" "}
      </div>
      <div className="flex overflow-hidden space-x-8 divide-x mt-4">
        {data.map((p) => (
          <div className="pl-8 first:pl-0" key={p.userId.elementId}>
            <a className="font-semibold text-lg text-cyan-500 hover:text-cyan-600" href={`/user/${p.userId.properties.username}`}>{p.userId.properties.username}</a>
            <div className="text-sm text-gray-500">{p.score.toFixed(5)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
