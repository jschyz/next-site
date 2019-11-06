import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';

function NavLink({ route: { pathname, slug, title, selected }, onClick }) {
  const router = useRouter();
  const onlyHashChange = pathname === router.pathname;

  return (
    <div className={cn('nav-link', { selected })}>
      {// NOTE: use just anchor element for triggering `hashchange` event
      onlyHashChange ? (
        <a className={selected ? 'selected' : ''} href={pathname}>
          {title}
        </a>
      ) : (
        <Link href={slug} as={pathname}>
          <a onClick={onClick}>{title}</a>
        </Link>
      )}
      <style jsx>{`
        div.selected {
          box-sizing: border-box;
        }
        .nav-link {
          display: flex;
        }
        .nav-link :global(a) {
          text-decoration: none;
          font-size: var(--font-size-primary);
          line-height: var(--line-height-primary);
          color: var(--accents-6);
          box-sizing: border-box;
        }
        .selected :global(a) {
          font-weight: 600;
          color: #000;
        }
        .nav-link:hover :global(a) {
          color: #000;
        }
        span {
          color: #979797;
        }
        @media screen and (max-width: 950px) {
          div {
            padding-top: 0;
            padding-left: 0;
            padding-bottom: 0;
          }
          div.selected {
            border-left: none;
            padding-left: 0;
          }
          .nav-link :global(a) {
            display: flex;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}

export default NavLink;
