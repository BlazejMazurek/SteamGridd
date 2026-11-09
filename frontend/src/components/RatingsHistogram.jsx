import './RatingsHistogram.css'

function RatingsHistogram({ counts }) {
  const max = Math.max(...counts.map((c) => c.count))

  return (
    <div className="histogram">
      <h2>Oceny:</h2>
      <div className="histogram-bars">
        {counts.map((c) => (
          <div className="histogram-col" key={c.value}>
            <div
              className="histogram-bar"
              style={{ height: `${(c.count / max) * 80}px` }}
            ></div>
            <span className="histogram-value">{c.value}</span>
            <span className="histogram-count">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RatingsHistogram