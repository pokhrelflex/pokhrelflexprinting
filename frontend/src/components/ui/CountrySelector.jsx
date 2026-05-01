import { useState, useRef, useEffect } from 'react';
import { searchCountries, getPopularCountries } from '../countries';

const flagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
const flagUrl2x = (code) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

export default function CountrySelector({ value, onChange, placeholder = 'Country', required }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const popular = getPopularCountries();
  const results = query.trim() ? searchCountries(query) : searchCountries('');

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleOpen = () => {
    if (!open) { setOpen(true); setQuery(''); }
  };

  const handleToggle = () => {
    setOpen(o => { if (o) setQuery(''); return !o; });
  };

  const handleSelect = (country) => {
    onChange(country);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`w-full border bg-white/60 backdrop-blur-sm px-4 py-3 text-sm flex items-center gap-2 transition-colors cursor-pointer ${open ? 'border-[#1B4F8A] bg-white/80' : 'border-[#1A1A1A]/8'}`}
        onClick={handleOpen}
      >
        {value && !open && (
          <span className="w-5 h-4 overflow-hidden flex-shrink-0 inline-flex items-center">
            <img src={flagUrl(value.code)} srcSet={`${flagUrl2x(value.code)} 2x`} alt="" className="w-full h-full object-contain" />
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          value={open ? query : (value?.name ?? '')}
          onChange={e => setQuery(e.target.value)}
          onClick={handleOpen}
          placeholder={open ? 'Choose your country' : placeholder}
          readOnly={!open}
          className={`flex-1 bg-transparent outline-none text-sm min-w-0 ${(!open && !value) ? 'text-[#1A1A1A]/30' : 'text-[#1A1A1A]'} ${!open ? 'cursor-pointer' : 'cursor-text'}`}
        />
        <button
          type="button"
          onClick={e => { e.stopPropagation(); handleToggle(); }}
          className="flex-shrink-0 p-0.5 focus:outline-none"
          tabIndex={-1}
        >
          <svg className={`w-4 h-4 text-[#1A1A1A]/40 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <input tabIndex={-1} required={required} value={value?.name ?? ''} onChange={() => {}} className="absolute inset-0 opacity-0 pointer-events-none w-full" aria-hidden="true" />

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#1A1A1A]/10 shadow-lg max-h-64 flex flex-col overflow-hidden">
          <div className="overflow-y-auto flex-1">
            {!query.trim() && (
              <>
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/40">Popular</p>
                {popular.map(country => (
                  <CountryOption key={`pop-${country.code}`} country={country} selected={value?.code === country.code} onSelect={handleSelect} />
                ))}
                <div className="border-t border-[#1A1A1A]/8 my-1" />
                <p className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/40">All Countries</p>
              </>
            )}
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#1A1A1A]/40">No results found</p>
            ) : (
              results.map(country => (
                <CountryOption key={country.code} country={country} selected={value?.code === country.code} onSelect={handleSelect} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CountryOption({ country, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(country)}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors hover:bg-[#1B4F8A]/5 ${selected ? 'bg-[#1B4F8A]/8 text-[#1B4F8A]' : 'text-[#1A1A1A]'}`}
    >
      <span className="w-5 h-4 overflow-hidden flex-shrink-0 inline-flex items-center">
        <img src={flagUrl(country.code)} srcSet={`${flagUrl2x(country.code)} 2x`} alt="" className="w-full h-full object-contain" />
      </span>
      <span className="flex-1 truncate">{country.name}</span>
      <span className="text-xs text-[#1A1A1A]/40 flex-shrink-0">{country.countryCode}</span>
    </button>
  );
}
