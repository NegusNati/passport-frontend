type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T
  className?: string
  children?: React.ReactNode
  color?: string
  speed?: React.CSSProperties['animationDuration']
  thickness?: number
}

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 0.2,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button'

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[10px] ${className}`}
      {...rest}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style,
      }}
    >
      <div
        className="animate-star-movement-bottom absolute right-[-250%] bottom-[-11px] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="animate-star-movement-top absolute top-[-10px] left-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="relative z-1 rounded-[10px] border-gray-800 bg-transparent px-[26px] py-[16px] text-center text-[16px] text-white">
        {children}
      </div>
    </Component>
  )
}

export default StarBorder
