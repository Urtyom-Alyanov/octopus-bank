export const AvatarBoilerplate: React.FC<{ src?: string }> = ({ src }) =>
  src ? (
    <img
      src={src}
      className="w-14 h-14 lg:h-20 lg:w-20 rounded-xl object-cover object-center"
      alt="Avatar"
    />
  ) : (
    <div className="w-14 h-14 lg:h-20 lg:w-20 rounded-xl bg-slate-500"></div>
  );
