import type React from 'react';
import { Clock } from 'lucide-react';
import { Badge, type BadgeVariant } from '../Badge/Badge';

export interface RecipeBadge {
  id: string | number;
  label: string;
  variant?: BadgeVariant;
}

export type RecipeCardSize = 'small' | 'large';

export interface RecipeCardProps {
  /** Rezept-Domain-Objekt (optional für Bequemlichkeit im Frontend) */
  recipe?: {
    id?: string | number;
    title?: string;
    imageUrl?: string;
    prepTime?: string | number;
    categories?: Array<{ id: string | number; name: string }>;
  };
  /** Titel des Rezepts */
  title?: string;
  /** Vollständige Bild-URL */
  imageUrl?: string;
  /** Zubereitungszeit in Minuten */
  prepTime?: string | number;
  /** Badges / Kategorien */
  badges?: RecipeBadge[];
  /** Größe der Karte: 'small' oder 'large' */
  size?: RecipeCardSize;
  /** Custom Wrapper Render-Funktion für Router-Links (z.B. react-router-dom Link) */
  renderLink?: (props: { children: React.ReactNode; className?: string }) => React.ReactNode;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

const DEFAULT_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop';

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  title: propsTitle,
  imageUrl: propsImageUrl,
  prepTime: propsPrepTime,
  badges: propsBadges,
  size = 'small',
  renderLink,
  className = '',
}) => {
  const title = propsTitle || recipe?.title || 'Rezept Titel';
  const prepTime = propsPrepTime || recipe?.prepTime || '25';

  const derivedBadges: RecipeBadge[] = propsBadges ||
    (recipe?.categories?.map((cat) => ({ id: cat.id, label: cat.name })) ?? []);

  const image = propsImageUrl || recipe?.imageUrl || DEFAULT_PLACEHOLDER_IMAGE;

  const ContainerWrapper: React.FC<{ children: React.ReactNode; wrapperClass?: string }> = ({ children, wrapperClass = '' }) => {
    if (renderLink) {
      return <>{renderLink({ children, className: wrapperClass })}</>;
    }
    return <div className={wrapperClass}>{children}</div>;
  };

  // --- LARGE SIZE (Featured / Hero) ---
  if (size === 'large') {
    return (
      <ContainerWrapper wrapperClass={`relative w-full h-[240px] rounded-16 overflow-hidden text-content-text-inverted ${className}`}>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-recipe-card-large-background-default-start via-recipe-card-large-background-default-middle to-recipe-card-large-background-default-end" />

        <div className="absolute inset-0 p-16 flex flex-col z-10">
          <div className="flex gap-8 flex-wrap">
            {derivedBadges.map((b) => (
              <Badge key={b.id} label={b.label} variant={b.variant || 'glass'} />
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-end gap-4">
            <h3 className="typography-heading-medium line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-4 text-white/90">
              <Clock
                size={16}
                strokeWidth={1.5}
                absoluteStrokeWidth={true}
              />
              <span className="typography-body-medium">{prepTime} Min.</span>
            </div>
          </div>
        </div>
      </ContainerWrapper>
    );
  }

  // --- SMALL SIZE (Standard Grid / Horizontal) ---
  return (
    <div className={`w-full max-w-[180px] ${className}`}>
      <ContainerWrapper wrapperClass="relative w-full aspect-[180/140]  rounded-12 overflow-hidden text-content-text-inverted">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-recipe-card-small-background-default-start to-recipe-card-small-background-default-end" />

        <div className="absolute inset-0 p-8 flex flex-col z-10">
          <div className="flex gap-4 flex-wrap">
            {derivedBadges.map((b) => (
              <Badge key={b.id} label={b.label} variant={b.variant || 'glass'} />
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-end gap-4">
            <div className="flex items-center gap-4 text-white/90">
              <Clock
                size={16}
                strokeWidth={1.5}
                absoluteStrokeWidth={true}
              />
              <span className="typography-body-small">{prepTime} Min.</span>
            </div>
          </div>
        </div>
      </ContainerWrapper>
      <h3 className="typography-heading-small-emph text-content-text-default line-clamp-2 mt-8">
        {title}
      </h3>
    </div>
  );
};
