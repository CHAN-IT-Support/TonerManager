import React from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useI18n } from '@/lib/i18n';

export default function TonerCard({
  toner,
  positions = [],
  cabinetNameById,
  activePosition,
  isHighlighted,
  onSelect,
  onPositionSelect
}) {
  const { t } = useI18n();
  const getTonerColor = () => {
    const colors = {
      schwarz: 'from-slate-700 to-slate-900',
      cyan: 'from-cyan-400 to-cyan-600',
      magenta: 'from-pink-400 to-pink-600',
      gelb: 'from-yellow-300 to-yellow-500',
      resttonerbehälter: 'from-emerald-500 to-emerald-700'
    };
    return colors[toner?.color] || 'from-slate-400 to-slate-600';
  };

  const getTextColor = () => {
    return toner?.color === 'gelb' ? 'text-amber-900' : 'text-white';
  };

  if (!toner) return null;

  const getPositionLabel = (position) => {
    const cabinetName = cabinetNameById?.get(position.cabinet_id);
    const slot = `${String.fromCharCode(65 + position.row)}${position.column + 1}`;
    return { cabinetName, slot, label: cabinetName ? `${cabinetName} ${slot}` : slot };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-6 bg-gradient-to-br shadow-xl cursor-pointer",
        getTonerColor(),
        isHighlighted && "ring-4 ring-green-400"
      )}
      onClick={onSelect}
    >
      <div className={cn("flex items-start justify-between", getTextColor())}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            {toner.color === 'resttonerbehälter' ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <Package className="w-6 h-6" />
            )}
            <span className="text-sm font-medium opacity-80">
              {toner.color === 'resttonerbehälter' ? t('common.restToner') : t('common.toner')}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{toner.model}</h3>
          <p className="text-sm opacity-80">{toner.name}</p>
        </div>
        
        {positions.length > 0 && (
          <div className="flex flex-col items-end gap-2 w-full">
            <div className="flex flex-nowrap justify-end gap-2 max-w-full overflow-x-auto py-0.5">
              {positions.map((position) => {
                const { label } = getPositionLabel(position);
                const isActive = activePosition
                  && activePosition.cabinet_id === position.cabinet_id
                  && activePosition.row === position.row
                  && activePosition.column === position.column;
                return (
                  <button
                    key={`${position.cabinet_id}-${position.row}-${position.column}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onPositionSelect?.(position);
                    }}
                    className={cn(
                      "text-xs px-3 py-2 rounded-xl border text-center leading-tight flex flex-col items-center gap-1 whitespace-nowrap",
                      isActive
                        ? "bg-white text-slate-900 border-white"
                        : "bg-white/20 text-white border-white/30"
                    )}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {toner.stock !== undefined && (
        <div className={cn("mt-4 pt-4 border-t border-white/20", getTextColor())}>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">{t('common.stock')}</span>
            <span className="text-xl font-bold">{toner.stock} {t('common.pieces')}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
