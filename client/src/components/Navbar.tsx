export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6" style={{ height: "64px", backgroundColor: "#0F3D57" }}>
      {/* Left Side - Logo & Text */}
      <div className="flex items-center">
        <img
          src="https://media.licdn.com/dms/image/v2/D560BAQGcR7_HwEkKmA/company-logo_200_200/company-logo_200_200/0/1699232615152/novintix_logo?e=2147483647&v=beta&t=3XAk48qckTMdWC62Op9WZpvM-tYNKPth5DU6yrYIk60"
          alt="Logo"
          style={{ width: "32px", height: "32px" }}
        />
        <span className="text-white font-semibold text-lg" style={{ marginLeft: "10px", fontSize: "18px", fontWeight: "600" }}>
          Profile
        </span>
      </div>

      {/* Right Side - Profile Badge */}
      <div
        className="flex items-center justify-center text-white rounded-full"
        style={{
          width: "36px",
          height: "36px",
          backgroundColor: "white",
          color: "#0F3D57",
          borderRadius: "9999px",
          fontWeight: "600",
        }}
      >
        DS
      </div>
    </nav>
  );
}
