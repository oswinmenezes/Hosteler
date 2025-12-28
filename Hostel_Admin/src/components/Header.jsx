export default function Header({ title }) {
  return (
    <header>
      <h3 className="section-title">{title}</h3>

      <input
        className="search-box"
        placeholder="Search..."
      />
    </header>
  );
}
