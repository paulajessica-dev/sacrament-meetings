import NavLinks from "./NavLinks";
export default function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header className="bg-ward text-white py-4 shadow-md print:hidden">
      {" "}
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-xl font-bold">Riverside Ward</h1>{" "}
          <p className="text-sm text-blue-200">{today}</p>{" "}
        </div>{" "}
        <NavLinks />{" "}
      </div>{" "}
    </header>
  );
}
