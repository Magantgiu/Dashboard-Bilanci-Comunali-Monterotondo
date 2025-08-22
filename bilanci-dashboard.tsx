import React, { useState } from 'react';

const BudgetDashboard = () => {
  const [selectedBubble, setSelectedBubble] = useState(null);
  const [hoveredBubble, setHoveredBubble] = useState(null);

  // Dati reali delle entrate (in milioni €)
  const entrate = [
    // Zona aumenti oltre 25%
    { id: 'entrate_capitale', nome: 'Entrate in Conto Capitale', valore: 18.90, variazione: 35, x: 280, y: 120, categoria: 'capitale' },
    { id: 'entrate_tributarie', nome: 'Entrate Tributarie', valore: 17.43, variazione: 35, x: 200, y: 140, categoria: 'correnti' },
    { id: 'conto_terzi_entrate', nome: 'Entrate Conto Terzi', valore: 14.57, variazione: 35, x: 350, y: 130, categoria: 'correnti' },
    
    // Zona valori stabili
    { id: 'trasferimenti', nome: 'Trasferimenti Correnti', valore: 5.96, variazione: 15, x: 150, y: 320, categoria: 'correnti' },
    { id: 'extratributarie', nome: 'Entrate Extratributarie', valore: 5.63, variazione: 15, x: 280, y: 350, categoria: 'correnti' },
    { id: 'anticipazioni', nome: 'Anticipazioni Tesoriere', valore: 5.00, variazione: 20, x: 350, y: 380, categoria: 'capitale' },
    
    // Zona riduzioni oltre 25%
    { id: 'accensione_prestiti', nome: 'Accensione Prestiti', valore: 1.31, variazione: -30, x: 250, y: 480, categoria: 'capitale' }
  ];

  // Dati reali delle spese (in milioni €)
  const spese = [
    // Zona aumenti oltre 25%
    { id: 'sviluppo_ambiente', nome: 'Sviluppo Sostenibile', valore: 15.26, variazione: 35, x: 720, y: 130, categoria: 'correnti' },
    { id: 'servizi_generali', nome: 'Servizi Generali', valore: 14.88, variazione: 35, x: 650, y: 140, categoria: 'correnti' },
    { id: 'diritti_sociali', nome: 'Diritti Sociali', valore: 7.13, variazione: 35, x: 780, y: 160, categoria: 'correnti' },
    { id: 'trasporti', nome: 'Trasporti e Mobilità', valore: 6.11, variazione: 35, x: 800, y: 120, categoria: 'correnti' },
    
    // Zona valori stabili  
    { id: 'istruzione', nome: 'Istruzione', valore: 4.95, variazione: 20, x: 680, y: 280, categoria: 'correnti' },
    { id: 'assetto_territorio', nome: 'Assetto Territorio', valore: 5.00, variazione: 20, x: 750, y: 320, categoria: 'capitale' },
    { id: 'sviluppo_economico', nome: 'Sviluppo Economico', valore: 0.81, variazione: 5, x: 620, y: 350, categoria: 'correnti' },
    { id: 'ordine_pubblico', nome: 'Ordine Pubblico', valore: 0.79, variazione: 5, x: 580, y: 380, categoria: 'correnti' },
    
    // Zona riduzioni oltre 25%
    { id: 'sport_tempo_libero', nome: 'Sport e Tempo Libero', valore: 0.61, variazione: -30, x: 650, y: 500, categoria: 'correnti' },
    { id: 'cultura', nome: 'Beni Culturali', valore: 0.27, variazione: -30, x: 720, y: 480, categoria: 'correnti' },
    { id: 'soccorso_civile', nome: 'Soccorso Civile', valore: 0.14, variazione: -35, x: 780, y: 520, categoria: 'correnti' },
    { id: 'turismo', nome: 'Turismo', valore: 0.008, variazione: -35, x: 750, y: 540, categoria: 'correnti' }
  ];

  // Calcola dimensione bolla (scala adattata ai valori reali)
  const getBubbleSize = (valore) => {
    return Math.max(15, Math.min(80, (valore / 18.85) * 80 + 20));
  };

  // Ottieni colore basato su variazione
  const getColor = (variazione, isSelected = false, isOtherSelected = false) => {
    if (isOtherSelected && !isSelected) return '#cccccc'; // Grigio quando altro è selezionato
    if (isSelected) return '#d73027';
    if (variazione >= 25) return '#7a9a01'; // Verde scuro per aumenti oltre 25%
    if (variazione >= 15) return '#8fac1c'; // Verde medio
    if (variazione >= 5) return '#a4bd37'; // Verde chiaro
    if (variazione >= -5) return '#999999'; // Grigio per valori stabili
    if (variazione >= -15) return '#f4a582'; // Arancione chiaro
    if (variazione >= -25) return '#d6604d'; // Arancione scuro
    return '#d73027'; // Rosso per riduzioni oltre 25%
  };

  // KPI calcolati
  const totaleEntrate = entrate.reduce((sum, item) => sum + item.valore, 0);
  const totaleSpese = spese.reduce((sum, item) => sum + item.valore, 0);
  const avanzoDisavanzo = totaleEntrate - totaleSpese;

  const selectedData = selectedBubble 
    ? [...entrate, ...spese].find(item => item.id === selectedBubble)
    : null;

  // Calcola percentuale sul totale
  const getPercentuale = (valore, isEntrata) => {
    const totale = isEntrata ? totaleEntrate : totaleSpese;
    return ((valore / totale) * 100).toFixed(1);
  };

  const isEntrata = selectedData && entrate.some(e => e.id === selectedData.id);

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {/* Area principale */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg h-full relative">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex space-x-8">
              <h2 className="text-2xl font-bold text-gray-700">ENTRATE</h2>
              <h2 className="text-2xl font-bold text-gray-700">SPESE</h2>
            </div>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
              MOSTRA
            </button>
          </div>

          {/* SVG per le visualizzazioni */}
          <svg width="100%" height="600" className="overflow-visible">
            {/* Linee di riferimento */}
            <line x1="50" y1="150" x2="450" y2="150" stroke="#ccc" strokeDasharray="5,5" />
            <line x1="50" y1="300" x2="450" y2="300" stroke="#ccc" strokeDasharray="5,5" />
            <line x1="550" y1="150" x2="900" y2="150" stroke="#ccc" strokeDasharray="5,5" />
            <line x1="550" y1="300" x2="900" y2="300" stroke="#ccc" strokeDasharray="5,5" />
            
            {/* Linea centrale */}
            <line x1="475" y1="50" x2="475" y2="550" stroke="#666" strokeWidth="2" />
            
            {/* Etichette */}
            <text x="250" y="140" textAnchor="middle" className="text-sm fill-gray-600">
              AUMENTI OLTRE IL 25%
            </text>
            <text x="250" y="290" textAnchor="middle" className="text-sm fill-gray-600">
              VALORI STABILI
            </text>
            <text x="750" y="140" textAnchor="middle" className="text-sm fill-gray-600">
              AUMENTI OLTRE IL 25%
            </text>
            <text x="750" y="290" textAnchor="middle" className="text-sm fill-gray-600">
              VALORI STABILI
            </text>
            <text x="250" y="520" textAnchor="middle" className="text-sm fill-gray-600">
              RIDUZIONI OLTRE IL 25%
            </text>
            <text x="750" y="520" textAnchor="middle" className="text-sm fill-gray-600">
              RIDUZIONI OLTRE IL 25%
            </text>

            {/* Cerchi punteggiati per evidenziare riduzioni significative - solo quando selezionato */}
            {selectedBubble && selectedData && selectedData.variazione < -25 && (
              <>
                {/* Cerchio entrate */}
                {entrate.some(e => e.id === selectedBubble && e.variazione < -25) && (
                  <circle 
                    cx="250" 
                    cy="500" 
                    r="80" 
                    fill="none" 
                    stroke="#d73027" 
                    strokeWidth="2" 
                    strokeDasharray="8,4"
                  />
                )}
                {/* Cerchio spese */}
                {spese.some(s => s.id === selectedBubble && s.variazione < -25) && (
                  <circle 
                    cx="720" 
                    cy="500" 
                    r="80" 
                    fill="none" 
                    stroke="#d73027" 
                    strokeWidth="2" 
                    strokeDasharray="8,4"
                  />
                )}
              </>
            )}

            {/* Bolle Entrate */}
            {entrate.map((item) => (
              <circle
                key={item.id}
                cx={item.x}
                cy={item.y}
                r={getBubbleSize(item.valore)}
                fill={getColor(item.variazione, selectedBubble === item.id, !!selectedBubble)}
                stroke={hoveredBubble === item.id ? "#333" : "transparent"}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedBubble(selectedBubble === item.id ? null : item.id)}
                onMouseEnter={() => setHoveredBubble(item.id)}
                onMouseLeave={() => setHoveredBubble(null)}
              />
            ))}

            {/* Bolle Spese */}
            {spese.map((item) => (
              <circle
                key={item.id}
                cx={item.x}
                cy={item.y}
                r={getBubbleSize(item.valore)}
                fill={getColor(item.variazione, selectedBubble === item.id, !!selectedBubble)}
                stroke={hoveredBubble === item.id ? "#333" : "transparent"}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedBubble(selectedBubble === item.id ? null : item.id)}
                onMouseEnter={() => setHoveredBubble(item.id)}
                onMouseLeave={() => setHoveredBubble(null)}
              />
            ))}

            {/* Legenda dimensioni */}
            <circle cx="100" cy="580" r="20" fill="none" stroke="#666" strokeWidth="1" />
            <text x="130" y="585" className="text-sm fill-gray-600">4,00M</text>
          </svg>

          {/* Scala colori */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-4 h-6 bg-green-600"></div>
              <span className="text-xs">+25%</span>
              <div className="w-4 h-6 bg-green-400"></div>
              <span className="text-xs">+5%</span>
              <div className="w-4 h-6 bg-gray-300"></div>
              <span className="text-xs">0</span>
              <div className="w-4 h-6 bg-orange-400"></div>
              <span className="text-xs">-5%</span>
              <div className="w-4 h-6 bg-red-500"></div>
              <span className="text-xs">-25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pannelli laterali */}
      <div className="w-80 p-4 space-y-4">
        {selectedData ? (
          <>
            {/* Pannello dettaglio voce selezionata */}
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 relative">
              <button 
                onClick={() => setSelectedBubble(null)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {isEntrata ? 'ENTRATE PER' : 'SPESE PER'}
                </div>
                <div className="text-sm font-bold text-gray-800 mb-2">
                  {selectedData.nome.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600 mb-1">PAGATI</div>
                <div className="text-2xl font-bold text-gray-800">
                  €{selectedData.valore.toFixed(2)}MLN
                </div>
                
                <div className="w-full bg-gray-300 h-4 rounded mt-3 mb-2">
                  <div 
                    className={`h-4 rounded ${selectedData.variazione >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(selectedData.variazione) * 2)}%` }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {selectedData.variazione > 0 ? '+' : ''}{selectedData.variazione.toFixed(1)}% SUL PREVENTIVO
                </div>
                <div className="text-sm text-gray-600">2014</div>
              </div>
            </div>

            {/* Pannello percentuale sul totale */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800 mb-2">
                  PERCENTUALE SUL TOTALE
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  DELLE {isEntrata ? 'ENTRATE' : 'SPESE'}
                </div>
                
                <div className="w-24 h-24 mx-auto mb-3 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="20"
                      strokeDasharray={`${getPercentuale(selectedData.valore, isEntrata) * 2.51} ${100 * 2.51}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                
                <div className="text-2xl font-bold text-gray-800">
                  {getPercentuale(selectedData.valore, isEntrata)}%
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Avanzo/Disavanzo - Solo quando nessuna selezione */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800 mb-2">
                  AVANZO/DISAVANZO
                </div>
                <div className="text-sm text-gray-600 mb-1">DI CASSA</div>
                <div className="text-sm text-gray-600 mb-2">2013</div>
                <div className="text-lg text-gray-600">
                  -1.005.227 €
                </div>
                <div className="text-sm text-gray-600 mb-2">2014</div>
                <div className="text-xl font-bold text-red-600">
                  -1.326.387 €
                </div>
              </div>
            </div>

            {/* Totali Entrate - Solo quando nessuna selezione */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800 mb-2">
                  ENTRATE - TOTALE
                </div>
                <div className="text-sm text-gray-600 mb-1">RISCOSSI</div>
                <div className="text-xl font-bold text-gray-800">
                  €{totaleEntrate.toFixed(2)}MLN
                </div>
                
                <div className="w-full bg-gray-300 h-4 rounded mt-3 mb-2">
                  <div className="bg-red-500 h-4 rounded" style={{ width: '27.74%' }}></div>
                </div>
                
                <div className="text-sm text-gray-600">-27.74% SUL PREVENTIVO</div>
                <div className="text-sm text-gray-600">2014</div>
              </div>
            </div>

            {/* Totali Spese - Solo quando nessuna selezione */}
            <div className="bg-white border rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800 mb-2">
                  SPESE - TOTALE
                </div>
                <div className="text-sm text-gray-600 mb-1">PAGATI</div>
                <div className="text-xl font-bold text-gray-800">
                  €{totaleSpese.toFixed(2)}MLN
                </div>
                
                <div className="w-full bg-gray-300 h-4 rounded mt-3 mb-2">
                  <div className="bg-red-500 h-4 rounded" style={{ width: '25.13%' }}></div>
                </div>
                
                <div className="text-sm text-gray-600">-25.13% SUL PREVENTIVO</div>
                <div className="text-sm text-gray-600">2014</div>
              </div>
            </div>
          </>
        )}

        <div className="text-center text-sm text-gray-500 mt-4">
          made by claudeAI
        </div>
      </div>
    </div>
  );
};

export default BudgetDashboard;