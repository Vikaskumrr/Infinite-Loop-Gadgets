import React from 'react';
import type { Product } from '../../types';
import './ProductSpecifications.scss';

interface ProductSpecificationsProps {
  specifications?: Product['specifications'];
}

const groups: Record<string, string[]> = {
  Display: ['display', 'screen', 'brightness', 'resolution'],
  Performance: ['processor', 'memory', 'storage', 'sensor', 'graphics'],
  Camera: ['camera', 'microphones'],
  Battery: ['battery', 'charging', 'playback'],
  Connectivity: ['connectivity', 'wireless', 'ports', 'audio'],
};

const groupForSpec = (key: string): string => {
  const normalized = key.toLowerCase();
  return Object.entries(groups).find(([, terms]) => terms.some((term) => normalized.includes(term)))?.[0] || 'Details';
};

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  if (!specifications || Object.keys(specifications).length === 0) return null;

  const grouped = Object.entries(specifications).reduce<Record<string, Array<[string, string]>>>((result, entry) => {
    const group = groupForSpec(entry[0]);
    result[group] = [...(result[group] || []), entry];
    return result;
  }, {});

  return (
    <div className="product-specifications">
      {Object.entries(grouped).map(([group, entries]) => (
        <section key={group}>
          <h4>{group}</h4>
          <dl>
            {entries.map(([key, value]) => (
              <React.Fragment key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
};

export default ProductSpecifications;
