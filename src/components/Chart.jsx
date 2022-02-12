import { useState, useEffect, PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import millify from "millify";
import { format, fromUnixTime } from "date-fns";

const Chart = ({ coinHistory, period, color }) => {
  const chartColor = color || "#1f2937";
  const [screenSize, setScreenSize] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(2.35);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 768) setAspectRatio(1);
    else if (screenSize < 1024) setAspectRatio(16 / 9);
    else setAspectRatio(2.35);
  }, [screenSize]);

  const chartData = coinHistory
    ?.filter((item) => item.price && item.price > 0)
    .map((item) => ({ price: parseFloat(item.price), time: item.timestamp }));
  chartData.reverse();

  const [chartState, setChartState] = useState({
    data: chartData,
    left: "dataMin",
    right: "dataMax",
    refAreaLeft: "",
    refAreaRight: "",
    refAreaLeftIndex: -1,
    refAreaRightIndex: -1,
    animation: true,
    bottom: "dataMin",
    top: "dataMax",
    
  });

  const zoom = () => {
    let { refAreaLeft, refAreaRight, refAreaLeftIndex, refAreaRightIndex } =
      chartState;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setChartState({
        ...chartState,
        refAreaLeft: "",
        refAreaRight: "",
        refAreaLeftIndex: -1,
        refAreaRightIndex: -1,
      });
      return;
    }

    // xAxis domain
    if (refAreaLeftIndex > refAreaRightIndex) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
      [refAreaLeftIndex, refAreaRightIndex] = [
        refAreaRightIndex,
        refAreaLeftIndex,
      ];
    }
    
    // yAxis domain
    const zoomedData = chartData.slice(refAreaLeftIndex, refAreaRightIndex)
    const refBottom = zoomedData.reduce((prev, curr) => prev.price < curr.price ? prev : curr).price;
    const refTop = zoomedData.reduce((prev, curr) => prev.price < curr.price ? curr : prev).price;
    console.log(refBottom, refTop);

    setChartState({
      ...chartState,
      left: refAreaLeft,
      right: refAreaRight,
      refAreaLeft: "",
      refAreaRight: "",
      refAreaLeftIndex: -1,
      refAreaRightIndex: -1,
      bottom: refBottom,
      top: refTop,
    });
  };

  const zoomOut = () => {
    setChartState({
      ...chartState,
      left: "dataMin",
      right: "dataMax",
      refAreaLeft: "",
      refAreaRight: "",
      refAreaLeftIndex: -1,
      refAreaRightIndex: -1,
      top: "dataMin",
      bottom: "dataMax",
    });
  };

  class XAxisTick extends PureComponent {
    render() {
      const { x, y, payload } = this.props;

      let unitFormat = "";
      let unitFormat2 = "";
      switch (period) {
        case "3h":
          unitFormat = "H:mm a";
          break;
        case "24h":
          unitFormat = "hh:mm a";
          break;
        case "7d":
          unitFormat = "MMM dd";
          unitFormat2 = "h:mm a";
          break;
        case "30d":
          unitFormat = "MMM dd";
          break;
        case "1y":
        case "3y":
        case "5y":
          unitFormat = "MMM yyyy";
          break;
        default:
          break;
      }
      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill="#666"
            text-anchor="middle"
            className="text-sm select-none"
          >
            {unitFormat2 ? (
              <tspan x={0} y={0}>
                {format(fromUnixTime(payload.value), unitFormat)}
              </tspan>
            ) : (
              format(fromUnixTime(payload.value), unitFormat)
            )}
            {unitFormat2 && (
              <tspan x={0} dy={16} className="hidden lg:block">
                {format(fromUnixTime(payload.value), unitFormat2)}
              </tspan>
            )}
          </text>
        </g>
      );
    }
  }

  class YAxisTick extends PureComponent {
    render() {
      const { x, y, payload } = this.props;

      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            dx={-2}
            y={0}
            dy={4}
            textAnchor="end"
            fill="#666"
            className="text-sm select-none"
          >
            {new Intl.NumberFormat('en-US', { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: payload.value >= 10 ? 2 : 5}).format(payload.value)}
          </text>
        </g>
      );
    }
  }

  const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 px-3 py-2 text-sm rounded-lg">
          <p>
            <span className="font-medium">Date:</span>{" "}
            {format(fromUnixTime(label), "PPPp")}
          </p>
          <p style={{ chartColor }}>
            <span className="font-medium">Price:</span>{" "}
            {payload[0].value < 10
              ? `$${millify(payload[0].value, { precision: 8 })}`
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(payload[0].value)}
          </p>
        </div>
      );
    }

    return null;
  };

  const { data, left, right, refAreaLeft, refAreaRight, bottom, top, animation } =
    chartState;

  return (
    <>
      <div className="w-full text-center text-sm lg:text-base mb-2">
        <span className="italic">Highlight section to Zoom In or &nbsp;</span>
        <button
          className="bg-neutral-50 px-2 py-1 rounded-md transition-colors duration-300 hover:bg-neutral-300"
          onClick={zoomOut}
        >
          Click to Zoom Out
        </button>
      </div>
      <div className="flex items-center justify-center px-4 mb-12">
        <ResponsiveContainer width="100%" aspect={aspectRatio}>
          <LineChart
            data={data}
            onMouseDown={(e) =>
              setChartState({
                ...chartState,
                refAreaLeft: e.activeLabel,
                refAreaLeftIndex: data.findIndex(
                  (item) => item.time === e.activeLabel
                ),
              })
            }
            onMouseMove={(e) => {
              chartState.refAreaLeft &&
                setChartState({
                  ...chartState,
                  refAreaRight: e.activeLabel,
                  refAreaRightIndex: data.findIndex(
                    (item) => item.time === e.activeLabel
                  ),
                });
            }}
            onMouseUp={zoom}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              allowDataOverflow
              dataKey="time"
              scale="time"
              domain={[left, right]}
              interval="preserveStartEnd"
              type="number"
              tick={<XAxisTick />}
              height={screenSize > 1024 ? 36 : 20}
            />
            <YAxis
              allowDataOverflow
              domain={[bottom, top]}
              type="number"
              tick={<YAxisTick />}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              dot={false}
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              isAnimationActive={animation}
            />

            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Chart;
