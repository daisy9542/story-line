"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [3996],
  {
    33996: function (e, t, a) {
      a.d(t, {
        iw: function () {
          return W;
        },
        ZP: function () {
          return H;
        },
        i$: function () {
          return R;
        },
      });
      var s = a(85893),
        n = a(1822),
        l = a.n(n),
        i = a(67294),
        r = a(55678),
        o = a(85719),
        c = a(91387),
        d = a(61523),
        x = a(89381),
        m = (e) => {
          let {
            isIframe: t,
            snapshots: a,
            onSnapshotClick: n,
            selectedTimestamp: l,
            BubblemapEnabled: i,
            searchAddress: m,
            accessLevel: p,
            onDataGenerated: u,
            setIsGenerating: h,
            isGenerating: f,
            chainId: g,
            isWhitelisted: b,
            setDropdownOpen: y,
            disableProxy: w,
            clearTimeouts: v,
            referrer: j,
          } = e;
          (0, o.zx)(p);
          let { setBubblemapGenerateModal: N } = (0, d.S)(),
            {
              isPremium: k,
              alwaysGenerate: _,
              recentDataOnOpen: S,
              forceDataOnRefresh: C,
              realTimeGeneration: I,
            } = (0, x.j)(),
            L = (0, o.BE)(p, o.L0.TokenBubblemap),
            A = async (e) => {
              if ((v(), y(!1), (t && I) || i || b)) {
                h(!0), t && null !== j && (p = 1e3);
                try {
                  N(!0);
                  let e = btoa(String(p)),
                    a = await fetch("/api/portal/bubblemap/createBubblemap", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "X-Client-Meta": e,
                      },
                      body: JSON.stringify({
                        searchAddress: m,
                        chainId: g,
                        proxy: !w,
                        referrer: t ? j : void 0,
                        force: !0,
                      }),
                    });
                  if (a.ok) {
                    let e = await a.json();
                    "OK" === e.status
                      ? (n(e.data.timestamp), u(e), N(!1))
                      : r.Am.error("Failed to load bubblemap data", {
                          containerId: "first",
                        });
                  } else {
                    let e = await a.json();
                    N(!1),
                      "Not enough INX tokens" === e.detail
                        ? r.Am.error(
                            "Not enough INX tokens to generate bubblemap",
                            {
                              containerId: "first",
                            }
                          )
                        : 404 === a.status
                        ? r.Am.error(e.status || "Not found", {
                            containerId: "first",
                          })
                        : 401 === a.status
                        ? r.Am.error(e.detail || "Unauthorized", {
                            containerId: "first",
                          })
                        : 400 === a.status && e.status
                        ? r.Am.error(e.status, {
                            containerId: "first",
                          })
                        : r.Am.error("Failed to generate bubblemap", {
                            containerId: "first",
                          });
                  }
                } catch (e) {
                  N(!1),
                    console.error("Failed to fetch bubblemap data:", e),
                    r.Am.error("Failed to fetch bubblemap data", {
                      containerId: "first",
                    });
                } finally {
                  N(!1), h(!1);
                }
              }
            },
            { setShowModal: E } = (0, c.d)(),
            T = a.length > 10,
            F = a.length > 0 ? a[0] : null;
          return (0, s.jsxs)("div", {
            className:
              "absolute top-full !z-51 mt-[8px] w-auto min-w-[72px] flex-col items-start justify-start rounded-md bg-white py-1 shadow md:mt-[10px]",
            children: [
              (0, s.jsx)("button", {
                className: "px-4 py-2 ".concat(f ? "opacity-50" : ""),
                onClick: () => {
                  (b || 0 === a.length || i || (t && _) || (t && I) || k) &&
                    A(a);
                },
                children: (0, s.jsxs)("div", {
                  className:
                    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white",
                  children: [
                    (0, s.jsx)("div", {
                      className: "relative ".concat(t ? "h-5 w-5" : "h-6 w-6"),
                      children:
                        k || (t && I)
                          ? (0, s.jsx)("div", {
                              className: "bubblemapMagic absolute ".concat(
                                t ? "h-5 w-5" : "h-6 w-6"
                              ),
                            })
                          : i || !(a.length > 0) || b
                          ? (0, s.jsx)("div", {
                              className: "bubblemapMagic absolute ".concat(
                                t ? "h-5 w-5" : "h-6 w-6"
                              ),
                            })
                          : (0, s.jsx)("div", {
                              className: "diamondOrange absolute inset-0",
                            }),
                    }),
                    (0, s.jsx)("div", {
                      className: "whitespace-nowrap ".concat(
                        t ? "text-xs" : "text-xs md:text-sm",
                        " font-normal leading-tight text-gray-700"
                      ),
                      children: f
                        ? "Generating..."
                        : k ||
                          (t && _) ||
                          (t &&
                            j &&
                            "inx" !== j &&
                            I &&
                            a.some((e) => e.toString().endsWith("00")))
                        ? "Refresh Bubblemap"
                        : b || k || i || 0 === a.length
                        ? "Generate Bubblemap"
                        : (0, s.jsxs)("div", {
                            className: "cursor-pointer whitespace-nowrap",
                            onClick: () => E(!0),
                            children: [
                              (0, s.jsxs)("span", {
                                className: "inline ".concat(
                                  t ? "text-xs" : "text-xs md:text-sm",
                                  " whitespace-nowrap text-sm font-normal leading-tight text-gray-700"
                                ),
                                children: ["Generate Bubblemaps with", " "],
                              }),
                              (0, s.jsx)("span", {
                                className:
                                  "gradient-tier-text text-normal inline whitespace-nowrap font-medium leading-none",
                                children: L,
                              }),
                            ],
                          }),
                    }),
                  ],
                }),
              }),
              (0, s.jsx)("div", {
                className: "h-px bg-gray-100",
              }),
              (0, s.jsx)("div", {
                className:
                  "flex flex-col items-start justify-start gap-1 px-1 pb-1 ".concat(
                    T
                      ? "".concat(
                          t ? "max-h-52" : "max-h-52 md:max-h-80",
                          " overflow-auto"
                        )
                      : "max-h-52 md:max-h-80 overflow-auto"
                  ),
                children:
                  0 === a.length
                    ? (0, s.jsx)("div", {
                        className: "px-4 py-2 ".concat(
                          t ? "text-xs" : "text-xs md:text-sm",
                          " text-gray-700"
                        ),
                        children: "No bubblemaps",
                      })
                    : a
                        .filter((e) => {
                          if (t) {
                            let t = e.toString().endsWith("00");
                            return t || (!t && e === F);
                          }
                          return !0;
                        })
                        .map((e, a) =>
                          (0, s.jsxs)(
                            "div",
                            {
                              className:
                                "inline-flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 "
                                  .concat(
                                    l === e ? "bg-gray-100" : "bg-white",
                                    " "
                                  )
                                  .concat(
                                    i || b || _ || (t && !_) || k
                                      ? ""
                                      : e !== F
                                      ? "opacity-50"
                                      : ""
                                  ),
                              role: "button",
                              onClick: () =>
                                i || b || k || _ || (t && !_) || e === F
                                  ? n(e)
                                  : void 0,
                              children: [
                                (0, s.jsx)("div", {
                                  className: "whitespace-nowrap ".concat(
                                    t ? "text-xs" : "text-xs md:text-sm",
                                    " font-semibold leading-tight text-gray-700"
                                  ),
                                  children: R(e),
                                }),
                                (0, s.jsx)("div", {
                                  className: ""
                                    .concat(
                                      t ? "text-xs" : "text-xs md:text-sm",
                                      " font-normal leading-tight "
                                    )
                                    .concat(
                                      l === e
                                        ? "text-gray-700"
                                        : "text-gray-400"
                                    ),
                                }),
                              ],
                            },
                            a
                          )
                        ),
              }),
            ],
          });
        },
        p = a(47786),
        u = a(30120),
        h = a(95087),
        d3 = a(36394),
        g = a(75412);
      let b = (0, i.forwardRef)((e, t) => {
        let {
            data: graphData,
            highlightedNode: n,
            onNodeClick: l,
            nodeToCluster: r,
            clusterAssignments: o,
            hiddenNodes: c = [],
            clustersComplete: d,
            secondView: x,
            categories: m,
            onBigSimulationComplete: p,
            onSmallSimulationComplete: u,
            showSmallSpinner: h,
            menuOpen: b,
            onZoomChange: y,
            isIframe: w,
            freeze: v,
          } = e,
          [j, N] = (0, i.useState)(!0),
          [k, _] = (0, i.useState)(!0),
          svgRef = (0, i.useRef)(null),
          containerRef = (0, i.useRef)(null),
          simulationRef = (0, i.useRef)(null),
          [L, A] = (0, i.useState)(null),
          E = (0, i.useRef)(0),
          T = (0, i.useRef)(!1),
          F = (0, i.useRef)(!1),
          isRendered = (0, i.useRef)(!1);
        (0, i.useEffect)(() => {
          !0 === T.current && ((T.current = !1), (E.current = 0));
        }, [graphData]),
          (0, i.useEffect)(
            () => () => {
              let e = simulationRef.current;
              e && ((isRendered.current = !0), e.stop(), e.on("tick", null));
            },
            []
          ),
          (0, i.useEffect)(() => {
            let e = () => {
              let e = simulationRef.current;
              e &&
                (document.hidden
                  ? (e.stop(), (isRendered.current = !0))
                  : (isRendered.current = !1));
            };
            return (
              document.addEventListener("visibilitychange", e),
              () => {
                document.removeEventListener("visibilitychange", e);
              }
            );
          }, []);
        let B = d3
          .zoom()
          .scaleExtent([0.1, 10])
          .filter(
            (e) =>
              "dblclick" !== e.type &&
              ("wheel" === e.type ||
                "mousedown" === e.type ||
                "touchstart" === e.type) &&
              !e.button
          )
          .wheelDelta((e) => -(0.005 * e.deltaY))
          .on("zoom", (e) => {
            let t = e.transform;
            d3.select(svgRef.current).select("g").attr("transform", t), A(t);
          });
        (0, i.useImperativeHandle)(t, () => ({
          zoomIn: () => {
            O(1.5);
          },
          zoomOut: () => {
            O(1 / 1.5);
          },
          stopRender: () => {
            (isRendered.current = !0), console.log("stopRender called");
          },
          startRender: () => {
            (isRendered.current = !1), console.log("startRender called");
          },
          centerOnNode: M,
          reSimulate: () => {
            _(!0),
              (E.current = -10),
              (F.current = !1),
              simulationRef.current && simulationRef.current.stop(),
              graphData.nodes.forEach((e) => {
                (e.x = void 0), (e.y = void 0);
              });
            let { width: e, height: t } =
                containerRef.current.getBoundingClientRect(),
              s = d3
                .select(svgRef.current)
                .attr("viewBox", "0 0 ".concat(e, " ").concat(t))
                .attr("preserveAspectRatio", "xMidYMid meet")
                .call(B);
            L && s.select("g").attr("transform", L.toString()), N(!1);
          },
        }));
        let O = (e) => {
          let t = d3.select(svgRef.current),
            { width: a, height: s } =
              containerRef.current.getBoundingClientRect(),
            n = (a / 2 - L.x) / L.k,
            l = (s / 2 - L.y) / L.k,
            i = b ? (0.1 * a) / 100 / L.k : 0;
          e > 1 ? (n -= i) : (n += i);
          let r = L.k * e,
            o = d3.zoomIdentity
              .translate(a / 2 - n * r, s / 2 - l * r)
              .scale(r);
          t.transition().duration(200).call(B.transform, o), A(o);
        };
        (0, i.useEffect)(() => {
          let e = d3.select(svgRef.current);
          return (
            e.call(B),
            L && e.select("g").attr("transform", L.toString()),
            () => {
              e.on(".zoom", null);
            }
          );
        }, [B, L]),
          (0, i.useEffect)(() => {
            if (!svgRef.current || !containerRef.current) return;
            let e = d3.select(svgRef.current),
              { width: t } = containerRef.current.getBoundingClientRect(),
              a = window.innerWidth <= 1025 ? 0.3 * t : 0.1 * t,
              s = L || d3.zoomIdentity,
              n = b ? s.x - a : s.x + a,
              l = d3.zoomIdentity.translate(n, s.y).scale(s.k);
            e.transition().duration(300).call(B.transform, l), A(l);
          }, [b]);
        let R = new Map(
            graphData.nodes.map((e, t) => [
              "".concat(e.address, "-").concat(t),
              t,
            ])
          ),
          z = new Map();
        m.forEach((e, t) => {
          let a = W(t);
          e.nodes.forEach((e) => {
            z.set(e, a);
          });
        });
        let M = (e) => {
          let t = graphData.nodes[e],
            { width: s, height: n } =
              containerRef.current.getBoundingClientRect(),
            l = (L.k, 2),
            i = d3.zoomIdentity
              .translate(s / 2 - t.x * l, n / 2 - t.y * l)
              .scale(l);
          d3
            .select(svgRef.current)
            .transition()
            .duration(500)
            .call(B.transform, i),
            A(i);
        };
        return (
          (0, i.useEffect)(() => {
            if (
              !containerRef.current ||
              !svgRef.current ||
              !d ||
              !graphData ||
              isRendered.current ||
              v
            )
              return;
            let { nodes, links } = graphData;
            if (0 === nodes.length || !d3) return;
            simulationRef.current && simulationRef.current.stop(),
              d3.select(svgRef.current).selectAll("*").remove();
            let { width, height } =
                containerRef.current.getBoundingClientRect(),
              svg = d3
                .select(svgRef.current)
                .attr("viewBox", "0 0 ".concat(width, " ").concat(height))
                .attr("preserveAspectRatio", "xMidYMid meet")
                .call(B);
            if (!svg) return;
            let containerGroup = svg.append("g");
            if (!containerGroup) return;
            if (j) {
              let e = window.innerWidth <= 1025,
                t = b ? -(e ? 0.3 * width : 0.1 * width) : 0,
                a =
                  w || e
                    ? d3.zoomIdentity
                        .translate((width / 2) * 0.5 + t, (height / 2) * 0.5)
                        .scale(0.5)
                    : d3.zoomIdentity.translate(t, 0).scale(0.8);
              svg.call(B.transform, a), A(a);
            }
            let o = (t) =>
              "number" == typeof t
                ? t
                : t && "object" == typeof t
                ? nodes.findIndex(
                    (e, a) =>
                      e.address === t.address &&
                      R.get("".concat(e.address, "-").concat(a)) === a
                  )
                : -1;
            m = links.filter((e) => {
              let t = o(e.source),
                a = o(e.target);
              return -1 !== t && -1 !== a && !c.includes(t) && !c.includes(a);
            });
            h = new Set();
            m.forEach((e) => {
              h.add(o(e.source)), h.add(o(e.target));
            });
            performance.now();
            let simulation = d3
              .forceSimulation(nodes)
              .force(
                "link",
                d3
                  .forceLink(m)
                  .id((e) => R.get("".concat(e.address, "-").concat(e.index)))
                  .distance(50)
                  .strength(0.7)
              )
              .force("charge", d3.forceManyBody().strength(-50))
              .force("center", d3.forceCenter(width / 2, height / 2))
              .force(
                "radial",
                d3
                  .forceRadial(
                    (e) => 50 + 50 * (1 - e.percentage / 100),
                    width / 2,
                    height / 2
                  )
                  .strength(0.02)
              )
              .force(
                "collision",
                d3
                  .forceCollide()
                  .radius((e) =>
                    h.has(R.get("".concat(e.address, "-").concat(e.index)))
                      ? 10
                      : 20.2 * Math.sqrt(e.percentage) + 5
                  )
                  .strength(0.8)
              )
              .on("tick", () => {
                (E.current += 1),
                  200 !== E.current || T.current || ((T.current = !0), u()),
                  4 !== E.current || F.current || ((F.current = !0), p()),
                  nodeGroups.attr("transform", (e) =>
                    "translate(".concat(e.x, ",").concat(e.y, ")")
                  ),
                  linkElements &&
                    linkElements
                      .attr("x1", (e) => e.source.x)
                      .attr("y1", (e) => e.source.y)
                      .attr("x2", (e) => e.target.x)
                      .attr("y2", (e) => e.target.y);
              });
            m.length > 1e3
              ? simulation.alphaDecay(0.9)
              : m.length > 800
              ? simulation.alphaDecay(0.8)
              : m.length > 600
              ? simulation.alphaDecay(0.7)
              : m.length > 400
              ? simulation.alphaDecay(0.1)
              : m.length > 300 && simulation.alphaDecay(0.05),
              (simulationRef.current = simulation);
            let nodeGroups = containerGroup
              .append("g")
              .attr("class", "nodes")
              .selectAll("g")
              .data(nodes)
              .enter()
              .append("g")
              .attr("cursor", "pointer")
              .attr("transform", (e) =>
                c.includes(R.get("".concat(e.address, "-").concat(e.index)))
                  ? null
                  : "translate(".concat(e.x, ",").concat(e.y, ")")
              )
              .call(
                d3
                  .drag()
                  .on("start", function (e) {
                    e.active || simulation.alphaTarget(0.1).restart(),
                      (e.subject.fx = e.subject.x),
                      (e.subject.fy = e.subject.y);
                  })
                  .on("drag", function (e) {
                    (e.subject.fx = e.x), (e.subject.fy = e.y);
                  })
                  .on("end", function (e) {
                    e.active || simulation.alphaTarget(0),
                      (e.subject.fx = null),
                      (e.subject.fy = null);
                  })
              );
            nodeGroups
              .append("circle")
              .attr("id", (e, t) =>
                "node-".concat(R.get("".concat(e.address, "-").concat(t)))
              )
              .attr("class", (e) => {
                let t = "bubbleCircle";
                return e.is_proxy && (t = "bubbleProxy"), t;
              })
              .attr(
                "r",
                (e) => 30.2 * Math.sqrt(e.is_proxy ? 0.18 : e.percentage) + 2
              )
              .attr("fill", (e) => {
                let t = R.get("".concat(e.address, "-").concat(e.index));
                return "labels" === x
                  ? z.has(t)
                    ? z.get(t) + "4D"
                    : "#3741514D"
                  : m.some((e) => o(e.source) === t || o(e.target) === t)
                  ? "#3498db4D"
                  : "#3741514D";
              })
              .attr("stroke", (e) => {
                let t = R.get("".concat(e.address, "-").concat(e.index));
                return "labels" === x
                  ? z.has(t)
                    ? z.get(t)
                    : "#374151"
                  : m.some((e) => o(e.source) === t || o(e.target) === t)
                  ? "#3498db"
                  : "#374151";
              })
              .attr("stroke-width", (e) => (e.is_proxy ? 2 : 4))
              .attr("stroke-dasharray", (e) => (e.is_proxy ? "6 3" : "0"))
              .attr("display", (e) =>
                c.includes(R.get("".concat(e.address, "-").concat(e.index)))
                  ? "none"
                  : "block"
              )
              .on("click", (e, t) => {
                !c.includes(R.get("".concat(t.address, "-").concat(t.index))) &&
                  l &&
                  l(R.get("".concat(t.address, "-").concat(t.index)));
              }),
              svg
                .append("defs")
                .append("marker")
                .attr("id", "endarrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 9)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-3L10,0L0,3")
                .attr("class", "arrow-head"),
              svg
                .append("defs")
                .append("marker")
                .attr("id", "startarrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 1)
                .attr("refY", 0)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M10,-3L0,0L10,3")
                .attr("class", "arrow-head"),
              nodeGroups
                .append("text")
                .attr("dx", 0)
                .attr("dy", ".35em")
                .attr("fill", "#fff")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .text((e) => e.address.slice(-4))
                .style("opacity", 0)
                .style("pointer-events", "none");
            let linkElements = containerGroup
              .append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(m)
              .enter()
              .append("line")
              .attr("x1", (e) => e.source.x)
              .attr("y1", (e) => e.source.y)
              .attr("x2", (e) => e.target.x)
              .attr("y2", (e) => e.target.y)
              .attr("class", (e) => {
                let t = "line";
                return (
                  e.isBidirectional || (e.forward > 0 && e.backward > 0)
                    ? (t += " bidirectional")
                    : e.forward > 0
                    ? (t += m.length > 100 ? " forward-static" : " forward")
                    : e.backward > 0 &&
                      (t += m.length > 100 ? " backward-static" : " backward"),
                  t
                );
              })
              .attr("marker-end", (e) =>
                e.forward > 0 ? "url(#endarrow)" : null
              )
              .attr("marker-start", (e) =>
                e.backward > 0 ? "url(#startarrow)" : null
              );
            L && containerGroup.attr("transform", L.toString()), N(!1);
          }, [graphData, d, c, x, m]),
          (0, i.useEffect)(() => {
            if (
              !simulationRef.current ||
              !containerRef.current ||
              !svgRef.current ||
              !d ||
              !svgRef ||
              !graphData
            )
              return;
            let { nodes: e, links: t } = graphData;
            0 !== e.length &&
              d3
                .select(svgRef.current)
                .selectAll("circle")
                .attr("stroke", (e) => {
                  let t = R.get("".concat(e.address, "-").concat(e.index));
                  if ("labels" === x)
                    return n === t ? "#FFF" : z.has(t) ? z.get(t) : "#374151";
                  {
                    let e = r[t];
                    return n === t ? "#FFF" : o[e] || "#374151";
                  }
                })
                .attr("fill", (e) => {
                  let t = R.get("".concat(e.address, "-").concat(e.index));
                  if ("labels" === x)
                    return z.has(t) ? z.get(t) + "4D" : "#3741514D";
                  {
                    let e = r[t];
                    return o[e] ? o[e] + "4D" : "#3741514D";
                  }
                })
                .attr("class", (e) =>
                  e.is_proxy
                    ? n === R.get("".concat(e.address, "-").concat(e.index))
                      ? "bubbleCircleSelected"
                      : "bubbleProxy"
                    : n === R.get("".concat(e.address, "-").concat(e.index))
                    ? "bubbleCircleSelected"
                    : "bubbleCircle"
                );
          }, [graphData, n, r, o, c, x, m]),
          (0, s.jsxs)("div", {
            ref: containerRef,
            className: "relative h-full w-full cursor-move overflow-hidden",
            children: [
              h &&
                (0, s.jsx)("div", {
                  className: "fixed z-10 ".concat(
                    w
                      ? "bottom-5 left-5 md:bottom-11 md:left-4"
                      : "bottom-5 left-5 md:bottom-24 md:left-24"
                  ),
                  children: (0, s.jsx)(g.Z, {
                    size: w ? 12 : 15,
                    color: "#ffffff",
                    speedMultiplier: 2,
                    loading: !0,
                  }),
                }),
              (0, s.jsx)("svg", {
                ref: svgRef,
                className: "h-full w-full",
              }),
            ],
          })
        );
      });
      b.displayName = "BubbleMap";
      var y = a(53903),
        w = a(22149),
        v = a(97762),
        j = a(12577),
        N = a(20684),
        k = a(11163),
        _ = a(42474),
        S = a.n(_),
        C = a(8286),
        I = a(78798),
        L = a(86492),
        A = (e) => {
          var t, a, n;
          let {
              isIframe: l,
              node: i,
              selectedNode: r,
              hiddenNodes: o,
              clusterAssignments: c,
              nodeToCluster: d,
              onClick: x,
              toggleNodeVisibility: m,
              color: p,
              isHidden: u,
            } = e,
            h = r === i.index,
            f = o.includes(i.index),
            g = void 0 !== d[i.index],
            b =
              g && null !== (a = p || c[d[i.index]]) && void 0 !== a
                ? a
                : "#374151",
            y = null !== r && g && d[i.index] === d[r],
            w = f
              ? "transparent"
              : h
              ? b
              : y
              ? "".concat(b, "80")
              : "".concat(b, "4D"),
            v = h ? "#ffffff" : b;
          return (0, s.jsx)(
            "div",
            {
              className: "cursor-pointer rounded-md border-2 px-4 py-[9px] "
                .concat(i.index > 0 ? "mt-[3px]" : "mt-0", " ")
                .concat(f ? "opacity-50" : "opacity-100"),
              id: "node-".concat(i.index),
              onClick: () => x(i.index),
              style: {
                borderStyle: i.is_proxy ? "dashed" : "solid",
                backgroundColor: w,
                borderColor: v,
                borderWidth: "2px",
              },
              children: (0, s.jsxs)("div", {
                className: "flex items-center justify-between ".concat(
                  h ? "text-white" : f ? "text-[#9A9DA3]" : "text-white"
                ),
                children: [
                  (0, s.jsxs)("div", {
                    className: "flex "
                      .concat(
                        l ? "min-w-[30px]" : "min-w-[40px]",
                        " flex-nowrap items-center whitespace-nowrap "
                      )
                      .concat(l ? "text-xs" : " text-sm", " font-semibold"),
                    children: ["#", i.index + 1],
                  }),
                  (0, s.jsx)("div", {
                    className:
                      "mx-2 flex-1 flex-nowrap truncate whitespace-nowrap ".concat(
                        l ? "text-xs" : " text-sm",
                        " font-medium"
                      ),
                    children:
                      null !== (n = i.name) && void 0 !== n ? n : "Unknown",
                  }),
                  (0, s.jsxs)("div", {
                    className: "flex items-center",
                    children: [
                      (0, s.jsxs)("div", {
                        className:
                          "flex flex-nowrap items-center whitespace-nowrap text-right ".concat(
                            l ? "text-xs" : " text-sm",
                            " font-semibold"
                          ),
                        children: [
                          null === (t = i.percentage) || void 0 === t
                            ? void 0
                            : t.toFixed(2),
                          "%",
                        ],
                      }),
                      (0, s.jsx)("button", {
                        onClick: (e) => {
                          e.stopPropagation(), m(i.index);
                        },
                        className: "ml-2",
                        children: f
                          ? (0, s.jsx)("div", {
                              className:
                                "eyeOff h-[17px] w-[17px] text-gray-500  ".concat(
                                  h ? "opacity-100" : "opacity-30"
                                ),
                            })
                          : (0, s.jsx)("div", {
                              className:
                                "eyeOn h-[17px] w-[17px] text-gray-500 ".concat(
                                  h ? "opacity-100" : "opacity-30"
                                ),
                            }),
                      }),
                    ],
                  }),
                ],
              }),
            },
            i.index
          );
        },
        E = (e) => {
          var t, a;
          let {
              isIframe: n,
              node: l,
              selectedNode: i,
              hiddenNodes: r,
              categoryColor: o = "#374151",
              onClick: c,
              toggleNodeVisibility: d,
            } = e,
            x = r.includes(l.index),
            m = i === l.index,
            p = x ? "transparent" : m ? o : "".concat(o, "4D"),
            u = x ? "#374151" : m ? "#ffffff" : o,
            h = l.is_proxy ? "dashed" : "solid";
          return (0, s.jsx)(
            "div",
            {
              className: "cursor-pointer rounded-md border-2 px-4 py-[9px] "
                .concat(x ? "opacity-50" : "opacity-100", " ")
                .concat(l.index > 0 ? "mt-[3px]" : "mt-0"),
              onClick: () => c(l.index),
              id: "node-".concat(l.index),
              style: {
                borderStyle: h,
                backgroundColor: p,
                borderColor: u,
                borderWidth: "2px",
              },
              children: (0, s.jsxs)("div", {
                className: "flex items-center justify-between ".concat(
                  x ? "text-[#9A9DA3]" : "text-white"
                ),
                children: [
                  (0, s.jsxs)("div", {
                    className: "flex "
                      .concat(
                        n ? "min-w-[30px]" : "min-w-[40px]",
                        " flex-nowrap items-center whitespace-nowrap "
                      )
                      .concat(n ? "text-xs" : " text-sm", " font-semibold"),
                    children: ["#", l.index + 1],
                  }),
                  (0, s.jsx)("div", {
                    className:
                      "mx-2 flex-1 flex-nowrap truncate whitespace-nowrap ".concat(
                        n ? "text-xs" : " text-sm",
                        " font-medium"
                      ),
                    children:
                      null !== (a = l.name) && void 0 !== a ? a : "Unknown",
                  }),
                  (0, s.jsxs)("div", {
                    className: "flex items-center",
                    children: [
                      (0, s.jsxs)("div", {
                        className:
                          "flex flex-nowrap items-center whitespace-nowrap text-right ".concat(
                            n ? "text-xs" : " text-sm",
                            " font-semibold"
                          ),
                        children: [
                          null === (t = l.percentage) || void 0 === t
                            ? void 0
                            : t.toFixed(2),
                          "%",
                        ],
                      }),
                      (0, s.jsx)("button", {
                        onClick: (e) => {
                          e.stopPropagation(), d(l.index);
                        },
                        className: "ml-2",
                        children: x
                          ? (0, s.jsx)("div", {
                              className:
                                "eyeOff h-[17px] w-[17px] text-gray-500 ".concat(
                                  m ? "opacity-100" : "opacity-30"
                                ),
                            })
                          : (0, s.jsx)("div", {
                              className:
                                "eyeOn h-[17px] w-[17px] text-gray-500 ".concat(
                                  m ? "opacity-100" : "opacity-30"
                                ),
                            }),
                      }),
                    ],
                  }),
                ],
              }),
            },
            l.index
          );
        },
        T = a(76265),
        F = a(48579);
      let P = [
          "#fd2c2c",
          "#ff32a6",
          "#fbbf24",
          "#FF8A00",
          "#2dd4bf",
          "#32ff62",
          "#8b5cf6",
          "#f472b6",
          "#2e6fff",
          "#38bdf8",
          "#d97706",
          "#16a34a",
          "#ef4444",
          "#6366f1",
          "#10b981",
          "#3b82f6",
          "#ec4899",
          "#f59e0b",
          "#34d399",
          "#f85df6",
          "#f43f5e",
          "#3b82f6",
          "#4ade80",
          "#facc15",
          "#f87171",
          "#22d3ee",
          "#fca5a5",
          "#c084fc",
        ],
        B = {
          is_burn: !1,
          is_lock: !1,
          is_pair: !1,
          is_contract: !1,
          is_team: !0,
          is_exchange: !1,
          is_presale: !0,
          is_tax: !1,
        },
        O = {
          ...B,
          is_contract: !1,
        },
        R = (e) => {
          if (!e || "number" != typeof e) return "Select Snapshot";
          try {
            let t = u.ou.fromSeconds(e).setLocale(navigator.language);
            if (!t.isValid) throw Error("Invalid date");
            return t.toFormat("yyyy-MM-dd HH:mm");
          } catch (e) {
            return "Select Snapshot";
          }
        },
        z = function (e) {
          let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          if (!e || "number" != typeof e)
            return a ? "Select" : "Select Snapshot";
          try {
            let s = u.ou.fromSeconds(e).setLocale(navigator.language),
              n = u.ou.now().setLocale(navigator.language);
            if (!s.isValid) return "-";
            let l = n.diff(s, [
              "seconds",
              "minutes",
              "hours",
              "days",
              "months",
              "years",
            ]);
            if (t) {
              if (60 > l.as("seconds")) {
                let e = Math.floor(l.as("seconds"));
                return a
                  ? "".concat(e, "s ago")
                  : ""
                      .concat(e, " ")
                      .concat(1 === e ? "second" : "seconds", " ago");
              }
              if (60 > l.as("minutes")) {
                let e = Math.floor(l.as("minutes"));
                return a
                  ? "".concat(e, "m ago")
                  : ""
                      .concat(e, " ")
                      .concat(1 === e ? "minute" : "minutes", " ago");
              }
            }
            if (1 > l.as("hours")) return "Now";
            if (24 > l.as("hours")) {
              let e = Math.floor(l.as("hours"));
              return a
                ? "".concat(e, "h ago")
                : "".concat(e, " ").concat(1 === e ? "hour" : "hours", " ago");
            }
            if (30 > l.as("days")) {
              let e = Math.floor(l.as("days"));
              return a
                ? "".concat(e, "d ago")
                : "".concat(e, " ").concat(1 === e ? "day" : "days", " ago");
            }
            if (12 > l.as("months")) {
              let e = Math.floor(l.as("months"));
              return a
                ? "".concat(e, "mo ago")
                : ""
                    .concat(e, " ")
                    .concat(1 === e ? "month" : "months", " ago");
            }
            let i = Math.floor(l.as("years"));
            return a
              ? "".concat(i, "y ago")
              : "".concat(i, " ").concat(1 === i ? "year" : "years", " ago");
          } catch (e) {
            return a ? "Select" : "Select Snapshot";
          }
        },
        W = (e) => P[e % P.length],
        M = (e, t) =>
          parseInt(
            S().createHash("sha256").update(e).digest("hex").slice(0, 8),
            16
          ) % t,
        D = (e) => {
          let t = M(e.sort().join(""), P.length);
          return P[t];
        },
        V = (e, t, a, s) =>
          s[a[t.findIndex((t) => t.address === e)]] || "#374151",
        X = (e, t, a) => {
          let s = {},
            n = {},
            l = 0,
            i = {};
          t.forEach((t) => {
            let s =
                "number" == typeof t.source
                  ? t.source
                  : t.source &&
                    "object" == typeof t.source &&
                    "address" in t.source
                  ? e.findIndex((e) => e.address === t.source.address)
                  : -1,
              n =
                "number" == typeof t.target
                  ? t.target
                  : t.target &&
                    "object" == typeof t.target &&
                    "address" in t.target
                  ? e.findIndex((e) => e.address === t.target.address)
                  : -1;
            -1 !== s &&
              -1 !== n &&
              (a.includes(s) ||
                a.includes(n) ||
                (i[s] || (i[s] = new Set()),
                i[n] || (i[n] = new Set()),
                i[s].add(n),
                i[n].add(s)));
          });
          let r = new Set(),
            o = (e, t) => {
              let l = [e];
              for (; l.length > 0; ) {
                let e = l.pop();
                void 0 === e ||
                  r.has(e) ||
                  a.includes(e) ||
                  (r.add(e),
                  (s[e] = t),
                  (n[t] = n[t] || []),
                  n[t].push(e),
                  i[e] &&
                    i[e].forEach((e) => {
                      l.push(e);
                    }));
              }
            };
          e.forEach((e, t) => {
            !r.has(t) && i[t] && (o(t, l), l++);
          });
          let c = {},
            d = {};
          return (
            Object.keys(n).forEach((t) => {
              let a = parseInt(t),
                s = n[a].map((t) => e[t].address);
              c[a] = D(s);
              let l = n[a].reduce((t, a) => t + e[a].percentage, 0);
              d[a] = l;
            }),
            e.forEach((e, t) => {
              let a = s[t];
              void 0 !== a &&
                ((e.clusterColor = c[a]), (e.clusterPercentage = d[a]));
            }),
            e
              .map((e, t) => t)
              .filter((e) => void 0 === s[e] && !a.includes(e))
              .forEach((l) => {
                let i = [];
                if (
                  (t.forEach((t) => {
                    let s =
                        "number" == typeof t.source
                          ? t.source
                          : "object" == typeof t.source && "index" in t.source
                          ? t.source.index
                          : "object" == typeof t.source && "address" in t.source
                          ? e.findIndex((e) => e.address === t.source.address)
                          : -1,
                      n =
                        "number" == typeof t.target
                          ? t.target
                          : "object" == typeof t.target && "index" in t.target
                          ? t.target.index
                          : "object" == typeof t.target && "address" in t.target
                          ? e.findIndex((e) => e.address === t.target.address)
                          : -1;
                    s !== l || -1 === n || a.includes(n)
                      ? n !== l || -1 === s || a.includes(s) || i.push(s)
                      : i.push(n);
                  }),
                  i.length > 0)
                ) {
                  let t = {};
                  if (
                    (i.forEach((e) => {
                      let a = s[e];
                      void 0 !== a && (t[a] = (t[a] || 0) + 1);
                    }),
                    Object.keys(t).length > 0)
                  ) {
                    let a = parseInt(
                      Object.entries(t).sort((e, t) => t[1] - e[1])[0][0]
                    );
                    (s[l] = a),
                      (e[l].clusterColor = c[a]),
                      (e[l].clusterPercentage = d[a]),
                      n[a].includes(l) || n[a].push(l);
                  }
                }
              }),
            {
              nodeToCluster: s,
              clusterAssignments: c,
              clusterNodes: n,
            }
          );
        };
      var H = (e) => {
        var t, a, n, x, f, g;
        let {
            isIframe: _,
            referrer: S,
            alwaysGenerate: P,
            isOpen: R,
            onClose: M,
            name: D,
            tokenaddress: H,
            image: G,
            symbol: U,
            symbolImage: K,
            snapshots: J,
            latestSnapshot: q,
            isTokenDataLoading: Y,
            disableProxy: Z,
            recentDataOnOpen: Q,
            forceDataOnRefresh: $,
            loadingState: ee,
            propTimestamp: et,
            initialDataOnLoad: ea,
          } = e,
          [es, en] = (0, i.useState)(Y),
          [el, ei] = (0, i.useState)(R),
          er = (0, k.useRouter)(),
          {
            link: eo,
            bubblemap: ec,
            timestamp: ed,
            searchAddress: ex,
            chainId: em,
            tooltip: ep,
          } = er.query,
          [eu, eh] = (0, i.useState)(!1),
          [ef, eg] = (0, i.useState)(!1),
          [eb, ey] = (0, i.useState)(!0),
          { accessLevel: ew } = (0, h._)(),
          [ev, ej] = (0, i.useState)(!1),
          [eN, ek] = (0, i.useState)(!1),
          [e_, eS] = (0, i.useState)(!1),
          [eC, eI] = (0, i.useState)(!1),
          [eL, eA] = (0, i.useState)(!_),
          [eE, eT] = (0, i.useState)(""),
          [eF, eP] = (0, i.useState)(!1),
          [eB, eO] = (0, i.useState)({
            name: "",
            symbol: "",
            logo: "",
            chainLogo: "",
          }),
          [eR, ez] = (0, i.useState)(!1),
          [eW, eM] = (0, i.useState)(!0),
          [eD, eV] = (0, i.useState)(!1),
          [eX, eH] = (0, i.useState)(0),
          { showBubblemapGenerateModal: eG } = (0, d.S)(),
          [eU, eK] = (0, i.useState)([]),
          { showModal: eJ, setShowModal: eq } = (0, c.d)(),
          eY = (0, i.useRef)(null);
        (0, i.useEffect)(() => {
          er.isReady && (_ || tw) && er.query.hideui && eh(!0);
        }, [er.isReady]);
        let eZ = (0, i.useRef)(null),
          eQ = () => {
            eZ.current && eZ.current.zoomIn();
          },
          e$ = () => {
            eZ.current && eZ.current.zoomOut();
          };
        (0, i.useEffect)(() => {
          if (_) return;
          let e = localStorage.getItem("bubblemapShowFilter");
          null !== e && eA(JSON.parse(e));
        }, []),
          (0, i.useEffect)(() => {
            localStorage.setItem("bubblemapShowFilter", JSON.stringify(eL));
          }, [eL]);
        let [e0, e1] = (0, i.useState)({
            nodes: [],
            links: [],
          }),
          [e5, e2] = (0, i.useState)({
            nodes: [],
            links: [],
          }),
          [e4, e3] = (0, i.useState)({}),
          [e6, e7] = (0, i.useState)({}),
          [e8, e9] = (0, i.useState)({}),
          [te, tt] = (0, i.useState)(J || []),
          [ta, ts] = (0, i.useState)(!1),
          [tn, tl] = (0, i.useState)(!1),
          [ti, tr] = (0, i.useState)(""),
          [to, tc] = (0, i.useState)(!0),
          [td, tx] = (0, i.useState)({
            name: "All relationships",
            symbol: "ALL",
            logo: "/icons/all_relationships.png",
            address: "-1",
          }),
          [tm, tp] = (0, i.useState)(() => {
            var e;
            return null !== (e = localStorage.getItem("bubblemapView")) &&
              void 0 !== e
              ? e
              : "group";
          }),
          [tu, th] = (0, i.useState)(() => {
            var e;
            return null !== (e = localStorage.getItem("bubblemapSecondView")) &&
              void 0 !== e
              ? e
              : "clusters";
          }),
          [tf, tg] = (0, i.useState)(null),
          [tb, ty] = (0, i.useState)(!(window.innerWidth <= 1025) && !_),
          [tw, tv] = (0, i.useState)(window.innerWidth <= 1025),
          [tj, tN] = (0, i.useState)(
            window.innerWidth >= 718 && window.innerWidth <= 1025
          ),
          [tk, t_] = (0, i.useState)(window.innerWidth < 332),
          [tS, tC] = (0, i.useState)(window.innerWidth < 328),
          [tI, tL] = (0, i.useState)(window.innerHeight <= 230),
          [tA, tE] = (0, i.useState)(!1),
          [tT, tF] = (0, i.useState)(!1),
          [tP, tB] = (0, i.useState)({}),
          [tO, tR] = (0, i.useState)(!1),
          [tz, tW] = (0, i.useState)(!1),
          [tM, tD] = (0, i.useState)(!1),
          tV = (0, i.useRef)(null),
          tX = (0, i.useRef)(td.logo);
        (0, i.useEffect)(() => {
          let e = () => {
            window.innerWidth <= 1025
              ? (window.innerHeight <= 260
                  ? (tC(!0), t_(!0), tN(!1), tL(!0))
                  : (tL(!1),
                    window.innerWidth < 328 ? tC(!0) : tC(!1),
                    (eB.name.length > 20 && window.innerWidth < 358) ||
                    (20 === eB.name.length && window.innerWidth < 348) ||
                    (19 === eB.name.length && window.innerWidth < 340) ||
                    (18 == eB.name.length && window.innerWidth < 332) ||
                    (eB.name.length < 18 && window.innerWidth < 328)
                      ? t_(!0)
                      : t_(!1),
                    window.innerWidth >= 718 ? tN(!0) : tN(!1)),
                tv(!0),
                ty(!1))
              : (tv(!1), tN(!1), t_(!1));
          };
          return (
            window.addEventListener("resize", e),
            e(),
            () => {
              window.removeEventListener("resize", e);
            }
          );
        }, []),
          (0, i.useEffect)(() => {
            tX.current !== td.logo && (tW(!1), (tX.current = td.logo));
          }, [td.logo]);
        let tH = (e) => {
            tB((t) => ({
              ...t,
              [e]: !0,
            }));
          },
          tG = null;
        tG = et || ed;
        let [tU, tK] = (0, i.useState)(tG ? Number(tG) : q);
        (0, i.useEffect)(() => {
          tG && (ei(!0), tK(Number(tG)));
        }, [tG]);
        let [tJ, tq] = (0, i.useState)(null),
          [tY, tZ] = (0, i.useState)(null),
          [tQ, t$] = (0, i.useState)(null),
          [t0, t1] = (0, i.useState)(null),
          [t5, t2] = (0, i.useState)(!1),
          [t4, t3] = (0, i.useState)(!1),
          [t6, t7] = (0, i.useState)([]),
          t8 = (0, o.zx)(ew),
          t9 = (e) => t8.features.includes(e),
          ae = t9(o.L0.TokenBubblemap),
          at = t9(o.L0.TokenBubblemapProxy),
          [aa, as] = (0, i.useState)(!1),
          [an, al] = (0, i.useState)(!1),
          [ai, ar] = (0, i.useState)(H ? O : B),
          ao = (0, i.useRef)(null),
          ac = (0, i.useRef)(null),
          ad = (0, i.useRef)(0),
          [ax, am] = (0, i.useState)(null),
          ap = () => {
            eS(!1), tg(null), eI((e) => !e);
          };
        async function au(e, t, a, s) {
          if (!t || !a || !s) return !1;
          try {
            let n = btoa(String(e)),
              l = await fetch("/api/portal/bubblemap/getBubblemapByTimestamp", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Client-Meta": n,
                },
                body: JSON.stringify({
                  searchAddress: a,
                  timestamp: s,
                  chainId: t,
                  proxy: !Z,
                  referrer: _ ? S : void 0,
                }),
              });
            if (!l.ok) return "no_proxies_found";
            let i = await l.json();
            if ("OK" !== i.status)
              return console.error("Failed to load bubblemap data"), !1;
            if (i.data.proxy_available) return i.data;
            return !1;
          } catch (e) {
            return console.error("Failed to fetch bubblemap data:", e), !1;
          }
        }
        async function ah(e, t, a, s) {
          if (!t || !a || !s) return !1;
          try {
            let n = btoa(String(e)),
              l = await fetch(
                "/api/portal/bubblemap/getProxyStatusByTimestamp",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Client-Meta": n,
                  },
                  body: JSON.stringify({
                    searchAddress: a,
                    timestamp: s,
                    chainId: t,
                    referrer: _ ? S : void 0,
                  }),
                }
              );
            if (!l.ok) return "no_proxies_found";
            let i = await l.json();
            if ("OK" !== i.status)
              return console.error("Failed to load bubblemap data"), !1;
            if (i.data.proxy_available) return i.data;
            return !1;
          } catch (e) {
            return console.error("Failed to fetch bubblemap data:", e), !1;
          }
        }
        (0, i.useEffect)(() => {
          aa && null !== ax && am(null);
        }, [aa]),
          (0, i.useEffect)(() => {
            if ((ey(!0), null == H)) return;
            let e = async (e, t, a) => {
              if ("" !== e && "undefined" !== e && "" !== a)
                try {
                  let s = btoa(String(t)),
                    n = await fetch(
                      "/api/portal/bubblemap/getBubblemapListing",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-Client-Meta": s,
                        },
                        body: JSON.stringify({
                          searchAddress: e,
                          chainId: a,
                        }),
                      }
                    ),
                    l = await n.json();
                  n.ok && "OK" === l.status && l.data
                    ? eg(!0 === l.data.enabled)
                    : eg(!1);
                } catch (e) {
                  console.error("Failed to fetch listing:", e), eg(!1);
                } finally {
                  ey(!1);
                }
            };
            el && "0x" !== H && e(H, ew, em);
          }, [H]),
          (0, i.useEffect)(() => {
            if (!er.isReady || ee) return;
            let e = async (e, t, a) => {
              if (e && a) {
                tl(!0), ts(!1);
                try {
                  let s = btoa(String(t)),
                    n = await fetch(
                      "/api/portal/bubblemap/getTimestampsForBubblemap",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "X-Client-Meta": s,
                        },
                        body: JSON.stringify({
                          searchAddress: e,
                          chainId: a,
                          referrer: _ ? S : void 0,
                        }),
                      }
                    ),
                    l = await n.json();
                  if (
                    "OK" !== l.status &&
                    "Token Address Not Valid" === l.status
                  )
                    return (
                      tl(!1),
                      r.Am.error("Token Address Not Valid for Bubblemap", {
                        containerId: "first",
                      })
                    );
                  if (P) {
                    if ("OK" === l.status) {
                      let e = parseInt(tG),
                        t =
                          0 === l.data.length
                            ? [e]
                            : l.data.includes(e)
                            ? l.data
                            : [e, ...l.data],
                        a = t[0],
                        s = u.ou.fromSeconds(a).toRelative();
                      tt(t), tr(s || "Unknown"), tK(e), ts(!0);
                    }
                  } else if ("OK" === l.status && l.data.length > 0) {
                    let t = l.data[0],
                      s = u.ou.fromSeconds(t).toRelative();
                    if ((tt(l.data), tr(s || "Unknown"), tG)) {
                      let t = parseInt(tG);
                      if (l.data.includes(t)) tK(t), ts(!0);
                      else {
                        ts(!1);
                        let t = "/bubblemaps/".concat(a, "/").concat(e);
                        er.push(t).then(() => er.reload());
                      }
                    }
                  }
                } catch (e) {
                  console.error("Failed to fetch timestamps:", e);
                } finally {
                  tl(!1);
                }
              }
            };
            el && "0x" !== H && e(H, ew, em);
          }, [ee]),
          (0, i.useEffect)(() => {
            !ee &&
              (tD(!1),
              tD(!0),
              !aa &&
                !an &&
                ta &&
                tU &&
                (async (e, t, a, s) => {
                  tc(!0);
                  try {
                    let i = eN ? null : ea;
                    if (i) (ea = null), ek(!0);
                    else {
                      let n = btoa(String(ew)),
                        l = await fetch(
                          (ae || ef || _) && t
                            ? "/api/portal/bubblemap/getBubblemapByTimestamp"
                            : "/api/portal/bubblemap/getBubblemap",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "X-Client-Meta": n,
                            },
                            body: JSON.stringify(
                              (ae || ef || _) && t
                                ? {
                                    searchAddress: e,
                                    timestamp: t,
                                    chainId: em,
                                    proxy: !a,
                                    referrer: _ ? s : void 0,
                                  }
                                : {
                                    searchAddress: e,
                                    chainId: em,
                                    proxy: !a,
                                    referrer: _ ? s : void 0,
                                  }
                            ),
                          }
                        );
                      i = await l.json();
                    }
                    if ("OK" === i.status) {
                      if (
                        (eO({
                          name: i.data.token_metadata.name,
                          symbol: i.data.token_metadata.symbol,
                          logo: i.data.token_metadata.logo,
                          chainLogo: i.data.token_metadata.chain_logo,
                        }),
                        td.address && td.address === i.data.address)
                      )
                        tx({
                          name: i.data.name,
                          symbol: i.data.symbol,
                          logo: i.data.logo,
                          address: i.data.address,
                        });
                      else if (
                        td.address &&
                        td.address.length > 0 &&
                        td.address !== i.data.address
                      ) {
                        var n, l;
                        let e =
                          null === (l = i.data) || void 0 === l
                            ? void 0
                            : null === (n = l.token_links) || void 0 === n
                            ? void 0
                            : n.find((e) => e.address === td.address);
                        e
                          ? tx({
                              name: e.name,
                              symbol: e.symbol,
                              logo: e.logo,
                              address: e.address,
                            })
                          : tx({
                              name: "All relationships",
                              symbol: "ALL",
                              logo: "/icons/all_relationships.png",
                              address: "-1",
                            });
                      } else
                        tx({
                          name: "All relationships",
                          symbol: "ALL",
                          logo: "/icons/all_relationships.png",
                          address: "-1",
                        });
                      en(!1), (aw.current = !1);
                      let e = i.data.nodes.map((e, t) => ({
                          ...e,
                          index: t,
                        })),
                        { filteredNodes: t, proxyNodes: a } = aN(e),
                        { filteredLinks: s, proxyLinks: r } = ak(
                          i.data.links,
                          a
                        ),
                        { filteredTokenLinks: o, proxyTokenLinks: c } = a_(
                          i.data.token_links,
                          a
                        );
                      tZ({
                        ...i.data,
                        nodes: t,
                        links: s,
                        token_links: o,
                      }),
                        t$({
                          nodes: a,
                          links: r,
                          token_links: c,
                        }),
                        t1({
                          ...i.data,
                          nodes: e,
                        }),
                        i.data.proxy_available && at
                          ? (tE(!0), t2(!1))
                          : 0 === a.length &&
                            (tE(!1),
                            t2(!1),
                            setTimeout(() => {
                              t2(!0);
                            }, 50)),
                        am(null),
                        at
                          ? tq({
                              ...i.data,
                              nodes: e,
                            })
                          : tq({
                              ...i.data,
                              nodes: t,
                              links: s,
                              token_links: o,
                            });
                    } else
                      r.Am.error("Failed to load bubblemap data", {
                        containerId: "first",
                      });
                  } catch (e) {
                    console.error("Failed to fetch bubblemap data:", e),
                      r.Am.error("Failed to fetch bubblemap data", {
                        containerId: "first",
                      });
                  } finally {
                    tc(!1);
                  }
                })(H, tU, Z, S));
          }, [tU, ta]);
        let af = (0, i.useRef)(null),
          ag = async (e) => {
            if (
              ee ||
              Z ||
              (eY.current && eY.current.abort(),
              !er.pathname.startsWith("/bubblemaps/"))
            )
              return;
            let t = new AbortController();
            eY.current = t;
            try {
              let a = await ah(ew, em, ex, e, {
                signal: t.signal,
              });
              if (t.signal.aborted) return;
              if (
                13 === ad.current &&
                (tE(!1), t$(null), am("proxies_missing"), af.current)
              ) {
                clearTimeout(af.current), (af.current = null);
                return;
              }
              if (
                !a ||
                "no_proxies_found" === a ||
                !(null == a ? void 0 : a.proxy_available) ||
                (null == a ? void 0 : a.proxy_available) !== !0
              ) {
                tE(!1),
                  t$(null),
                  (ad.current += 1),
                  (af.current = setTimeout(() => {
                    e && ag(e);
                  }, 5e3));
                return;
              }
              let s = await au(ew, em, ex, e, {
                signal: t.signal,
              });
              if (
                (s || (tE(!1), t$(null), am("no_proxies_found")),
                "no_proxies_found" === s ||
                  !(null == s ? void 0 : s.proxy_available) ||
                  (null == s ? void 0 : s.proxy_available) !== !0)
              ) {
                tE(!1), t$(null), am("no_proxies_found");
                return;
              }
              tE(!1), (ad.current = 13);
              let n = s.nodes.map((e, t) => ({
                  ...e,
                  index: t,
                })),
                { filteredNodes: l, proxyNodes: i } = aN(n),
                { filteredLinks: o, proxyLinks: c } = ak(s.links, i),
                { filteredTokenLinks: d, proxyTokenLinks: x } = a_(
                  s.token_links,
                  i
                ),
                m = [...(s.categories || [])],
                p = (e, t, a) => {
                  let s = m.find((t) => t.name === e);
                  s ||
                    ((s = {
                      name: e,
                      size: 0,
                      nodes: [],
                    }),
                    m.push(s));
                  let n = t.filter((e) => !s.nodes.includes(e));
                  (s.nodes = [...s.nodes, ...n]),
                    (s.size += n.reduce((e, t) => {
                      var s;
                      return (
                        e +
                        ((null === (s = a.find((e) => e.index === t)) ||
                        void 0 === s
                          ? void 0
                          : s.percentage) || 0)
                      );
                    }, 0));
                };
              i.forEach((e) => {
                e.is_pair
                  ? p("Pairs", [e.index], n)
                  : e.is_team
                  ? p("Team", [e.index], n)
                  : e.is_tax
                  ? p("Tax", [e.index], n)
                  : p("Proxies", [e.index], n);
              }),
                t$({
                  ...s,
                  nodes: i,
                  links: c,
                  token_links: x,
                  categories: m,
                }),
                t3(!0),
                am(null),
                r.Am.success("Proxies is available", {
                  containerId: "first",
                  autoClose: 3e3,
                }),
                af.current && (clearTimeout(af.current), (af.current = null));
            } catch (e) {
              tE(!1),
                t$(null),
                "AbortError" === e.name
                  ? console.log("Fetch aborted")
                  : console.error("Error fetching proxy-bubblemap-refetch:", e);
            }
          };
        (0, i.useEffect)(() => {
          if (
            !ee &&
            em &&
            !(ad.current >= 13) &&
            (null == tQ || !tQ.proxy_available) &&
            t5
          ) {
            if (Date.now() - 1e3 * tU > 36e5 || 0 !== te.indexOf(tU)) {
              tE(!1), t$(null), am("proxies_missing");
              return;
            }
            ag(null == tJ ? void 0 : tJ.timestamp);
          }
        }, [t5]);
        let ab = async () => {
          try {
            if (!address || !ex || !em || !tG) return;
            let e = btoa(String(ew)),
              t = await fetch(
                "/api/portal/bubblemap/deleteBubblemapTimestamp",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Client-Meta": e,
                  },
                  body: JSON.stringify({
                    searchAddress: ex,
                    chainId: em,
                    timestamp: tG,
                    senderAddress: address,
                  }),
                }
              );
            if (!t.ok) {
              404 === t.status
                ? r.Am.error("Snapshot Not Found", {
                    containerId: "first",
                  })
                : r.Am.error("Something went wrong!", {
                    containerId: "first",
                  });
              return;
            }
            r.Am.success("Timestamp deleted successfully", {
              containerId: "first",
            });
          } catch (e) {
            console.error("An error occurred:", e),
              r.Am.error("An error occurred. Please try again.", {
                containerId: "first",
              });
          } finally {
          }
        };
        (0, i.useEffect)(() => {
          if ((ez(!1), ee || !tJ)) return;
          let { nodes: e, links: t } = tJ;
          aj(e, B, eU),
            e1({
              nodes: e,
              links: t,
            }),
            ez(!0);
        }, [tJ]);
        let ay = [
            {
              chainId: "8453",
              bubblemapAddress: "0x75e6b648c91d222b2f6318e8ceeed4b691d5323f",
              addressesToHide: ["0x813Ba66252f6b5413A1Badb883a142E0a834b6A4"],
            },
          ],
          aw = (0, i.useRef)(!1),
          av = (0, i.useRef)(!1),
          aj = (e, t, a) => {
            ez(!1);
            let s = [],
              n = ay.find(
                (e) =>
                  e.chainId === em &&
                  e.bubblemapAddress.toLowerCase() ===
                    (null == H ? void 0 : H.toLowerCase())
              );
            e.forEach((e, l) => {
              a.includes(e.address)
                ? s.push(l)
                : ((null == n
                    ? void 0
                    : n.addressesToHide.some(
                        (t) => t.toLowerCase() === e.address.toLowerCase()
                      )) ||
                    (e.is_burn && !t.is_burn) ||
                    (e.is_lock && !t.is_lock) ||
                    (e.is_pair && !t.is_pair) ||
                    (e.is_tax && !t.is_tax) ||
                    (e.is_contract && !t.is_contract && !e.is_team) ||
                    (e.is_exchange && !t.is_exchange) ||
                    (e.is_presale && !t.is_presale) ||
                    (e.is_team && !t.is_team) ||
                    (_ &&
                      "etherfun" === S &&
                      e.address.toLowerCase() === H.toLowerCase())) &&
                  s.push(l);
            }),
              t7(s),
              aS(s, e);
          },
          aN = (e) => {
            let t = e.filter((e) => e.is_proxy);
            return {
              filteredNodes: e.filter((e) => !e.is_proxy),
              proxyNodes: t,
            };
          },
          ak = (e, t) => {
            let a = new Set(t.map((e) => e.index)),
              s = e.filter((e) => a.has(e.source) || a.has(e.target));
            return {
              filteredLinks: e.filter(
                (e) => !a.has(e.source) && !a.has(e.target)
              ),
              proxyLinks: s,
            };
          },
          a_ = (e, t) => {
            let a = new Set(t.map((e) => e.index)),
              s = e.map((e) => ({
                ...e,
                links: e.links.filter(
                  (e) => a.has(e.source) || a.has(e.target)
                ),
              }));
            return {
              filteredTokenLinks: e.map((e) => ({
                ...e,
                links: e.links.filter(
                  (e) => !a.has(e.source) && !a.has(e.target)
                ),
              })),
              proxyTokenLinks: s,
            };
          },
          aS = (e, t) => {
            let a = {
              is_burn: !1,
              is_lock: !1,
              is_pair: !1,
              is_team: !1,
              is_contract: !1,
              is_exchange: !1,
              is_presale: !1,
            };
            t.forEach((t, s) => {
              !e.includes(s) &&
                (t.is_burn && (a.is_burn = !0),
                t.is_lock && (a.is_lock = !0),
                t.is_pair && (a.is_pair = !0),
                t.is_tax && (a.is_tax = !0),
                t.is_contract && (a.is_contract = !0),
                t.is_team && (a.is_team = !0),
                t.is_exchange && (a.is_exchange = !0),
                t.is_presale && (a.is_presale = !0));
            }),
              ar((e) => ({
                ...e,
                is_burn: !!a.is_burn && e.is_burn,
                is_lock: !!a.is_lock && e.is_lock,
                is_pair: !!a.is_pair && e.is_pair,
                is_tax: !!a.is_tax && e.is_tax,
                is_contract: !!a.is_contract && e.is_contract,
                is_team: !!a.is_team && e.is_team,
                is_exchange: !!a.is_exchange && e.is_exchange,
                is_presale: !!a.is_presale && e.is_presale,
              }));
          },
          aC = (e) => {
            (av.current = !0),
              t7((t) => {
                let a = t.includes(e),
                  s = a ? t.filter((t) => t !== e) : [...t, e];
                return (
                  aS(s, e0.nodes),
                  eK((t) => {
                    let s = e0.nodes[e].address;
                    return a ? t.filter((e) => e !== s) : [...t, s];
                  }),
                  s
                );
              });
          },
          aI = (0, i.useRef)(t6),
          aL = (e) => {
            let t;
            av.current = !0;
            let a = null == tJ ? void 0 : tJ.nodes.filter((t) => t[e]);
            if (!a || 0 === a.length) return;
            let s = new Set(aI.current);
            ((t = a.every((e) => s.has(e.index))
              ? aI.current.filter((e) => !a.some((t) => t.index === e))
              : [...aI.current, ...a.map((e) => e.index)]).length !==
              aI.current.length ||
              t.some((e, t) => e !== aI.current[t])) &&
              (aS(t, tJ.nodes), t7(t));
          };
        (0, i.useEffect)(() => {
          aI.current = t6;
        }, [t6]);
        let aA = (0, i.useRef)(!1);
        (0, i.useEffect)(() => {
          if (
            aA.current ||
            !el ||
            !e0 ||
            (e0 &&
              Array.isArray(e0.nodes) &&
              Array.isArray(e0.links) &&
              0 === e0.nodes.length &&
              0 === e0.links.length) ||
            ee
          )
            return;
          let { nodes: e, links: t } = e0,
            {
              nodeToCluster: a,
              clusterAssignments: s,
              clusterNodes: n,
            } = X(e, t, t6);
          e3(a), e7(s), e9(n), t3(!0), (aA.current = !0);
        }, [e0]),
          (0, i.useEffect)(() => {
            if (ee || !tJ || 0 === Object.keys(tJ).length || !t4) return;
            ez(!1);
            let e = [],
              t = (e, t, a) =>
                t && a
                  ? {
                      source: e.source.index || t.index || t,
                      target: e.target.index || a.index || a,
                      forward: e.forward,
                      backward: e.backward,
                      clusterColor: t.clusterColor || "#ef4444",
                      clusterPercentage: t.clusterPercentage || 0,
                      isBidirectional: !1,
                    }
                  : null;
            if ("ALL" === td.symbol) {
              let a = [];
              tJ.links.forEach((e) => {
                let s = t(e, e.source, e.target);
                s && a.push(s);
              }),
                tJ.token_links.forEach((e) => {
                  e.links.forEach((e) => {
                    let s = tJ.nodes.find((t) => t.index === e.source),
                      n = tJ.nodes.find((t) => t.index === e.target),
                      l = t(e, s, n);
                    l && a.push(l);
                  });
                });
              let s = new Map();
              a.forEach((e) => {
                let t = "".concat(e.source, "-").concat(e.target),
                  a = "".concat(e.target, "-").concat(e.source);
                if (s.has(a)) {
                  let t = s.get(a);
                  (t.forward += e.backward),
                    (t.backward += e.forward),
                    (t.isBidirectional = !0);
                } else if (s.has(t)) {
                  let a = s.get(t);
                  (a.forward += e.forward), (a.backward += e.backward);
                } else s.set(t, e);
              }),
                (e = Array.from(s.values()));
            } else {
              let a = tJ.token_links.find((e) => e.symbol === td.symbol);
              e = a
                ? a.links
                    .map((e) => {
                      let a = tJ.nodes.find((t) => t.index === e.source),
                        s = tJ.nodes.find((t) => t.index === e.target);
                      return t(e, a, s);
                    })
                    .filter(Boolean)
                : tJ.links;
            }
            let {
              nodeToCluster: a,
              clusterAssignments: s,
              clusterNodes: n,
            } = X(tJ.nodes, e, t6);
            0 !== e0.nodes.length &&
              0 !== tJ.nodes.length &&
              (e3(a),
              e7(s),
              e9(n),
              t3(!0),
              e1({
                nodes: tJ.nodes,
                links: e,
              }),
              !1 === aw.current && (aw.current = !0),
              !0 === av.current && (av.current = !1),
              ez(!0));
          }, [td.symbol, t6, t4]);
        let aE = (e) => {
            if (((ad.current = 0), t$(null), tE(!1), "OK" === e.status)) {
              eO({
                name: e.data.token_metadata.name,
                symbol: e.data.token_metadata.symbol,
                logo: e.data.token_metadata.logo,
                chainLogo: e.data.token_metadata.chain_logo,
              }),
                tx({
                  name: "All relationships",
                  symbol: "ALL",
                  logo: "/icons/all_relationships.png",
                  address: "-1",
                });
              let t = e.data.nodes.map((e, t) => ({
                  ...e,
                  index: t,
                })),
                { filteredNodes: a, proxyNodes: s } = aN(t),
                { filteredLinks: n, proxyLinks: l } = ak(e.data.links, s),
                { filteredTokenLinks: i, proxyTokenLinks: r } = a_(
                  e.data.token_links,
                  s
                );
              tZ({
                ...e.data,
                nodes: a,
                links: n,
                token_links: i,
              }),
                t$({
                  nodes: s,
                  links: l,
                  token_links: r,
                }),
                t1({
                  ...e.data,
                  nodes: t,
                }),
                e.data.proxy_available && at
                  ? tE(!0)
                  : 0 === s.length &&
                    (tE(!1),
                    t2(!1),
                    setTimeout(() => {
                      t2(!0);
                    }, 50)),
                am(null),
                at
                  ? tq({
                      ...e.data,
                      nodes: t,
                    })
                  : tq({
                      ...e.data,
                      nodes: a,
                      links: n,
                      token_links: i,
                    });
            } else
              r.Am.error("Failed to load bubblemap data", {
                containerId: "first",
              });
            al(!0),
              setTimeout(() => al(!1), 1e3),
              tt((t) =>
                t.includes(e.data.timestamp) ? t : [e.data.timestamp, ...t]
              );
          },
          aT = () => {
            af.current && (clearTimeout(af.current), (af.current = null));
          },
          aF = (e) => {
            af.current && (clearTimeout(af.current), (af.current = null)),
              e !== tU && eV(!0),
              eI(!1),
              eS(!1),
              (av.current = !0),
              tK(Number(e)),
              (ad.current = 0);
            let t = new URL(window.location.href),
              a = t.searchParams.get("proxybutton"),
              s = t.searchParams.get("client"),
              n = t.searchParams.get("tooltip"),
              l = () => {
                let e = new URLSearchParams();
                a && e.set("proxybutton", a),
                  s && e.set("client", s),
                  n && e.set("tooltip", n);
                let t = e.toString();
                return t ? "?".concat(t) : "";
              };
            if (er.asPath.includes("/analytics/explorer/token")) {
              if (er.asPath.includes("/bubblemaps/")) {
                let t = er.asPath.replace(
                  /\/bubblemaps\/\d+/,
                  "/bubblemaps/".concat(e)
                );
                (t += l()), er.push(t);
              } else {
                let t = ""
                  .concat(er.asPath.replace(/\/$/, ""), "/bubblemaps/")
                  .concat(e);
                (t += l()), er.push(t);
              }
            } else {
              let t = "/bubblemaps/".concat(em, "/").concat(H, "/").concat(e);
              (t += l()), er.push(t);
            }
          },
          aP = (e) => {
            eZ.current && eZ.current.centerOnNode(e.index);
          },
          aB = () => {
            if (!eG) {
              if (
                (new URL(window.location.href),
                eY.current && eY.current.abort(),
                af.current && (clearTimeout(af.current), (af.current = null)),
                M(),
                er.asPath.includes("/analytics/explorer/token"))
              ) {
                let e = er.asPath.replace(/\/bubblemaps\/\d+/, "");
                er.push(e);
              } else
                er.asPath.includes("/bubblemaps/") && er.push("/bubblemaps");
            }
          },
          aO = () => {
            tg(null), eI(!1), eS(!e_);
          },
          aR = () => {
            let e = "group" === tm ? "list" : "group";
            tV.current &&
              tV.current.scrollTo({
                top: 0,
                behavior: "smooth",
              }),
              tp(e),
              localStorage.setItem("bubblemapView", e);
          },
          az = () => {
            let e = "clusters" === tu ? "labels" : "clusters";
            th(e), localStorage.setItem("bubblemapSecondView", e);
          },
          aW = (e) => {
            e4[e], eI(!1), eS(!1), tg(e);
          },
          aM = () => {
            ty(!tb);
          },
          aD = (e, t) => {
            e.symbol !== td.symbol && eV(!0),
              eI(!1),
              eS(!1),
              tg(null),
              tx({
                name: e.name,
                symbol: e.symbol,
                logo: e.logo,
                address: e.address,
              });
            let { pathname: a, query: s } = er,
              n = {
                ...s,
                link: t,
              };
            er.push({
              pathname: a,
              query: n,
            });
          },
          aV = (e, t) =>
            e.filter(
              (e) =>
                e.name.toLowerCase().includes(t.toLowerCase()) ||
                e.address.toLowerCase().includes(t.toLowerCase())
            ),
          aX = eE ? aV(e0.nodes, eE) : e0.nodes,
          aH = aX.reduce(
            (e, t) => {
              let a = e0.nodes.indexOf(t);
              if (t6.includes(a)) e.hidden.push(t);
              else if (void 0 !== e4[a]) {
                let s = e4[a];
                e.clusters[s] || (e.clusters[s] = []), e.clusters[s].push(t);
              } else e.other.push(t);
              return e;
            },
            {
              clusters: {},
              hidden: [],
              other: [],
            }
          );
        (0, i.useEffect)(() => {
          null !== tf && t6.includes(tf) && tg(null);
        }, [t6]),
          Object.keys(aH.clusters)
            .map((e) => {
              let t = parseInt(e, 10),
                a = aH.clusters[t],
                s = a.reduce((e, t) => e + (t.percentage || 0), 0);
              return {
                clusterId: t,
                nodes: a,
                totalPercentage: s,
              };
            })
            .sort((e, t) => t.totalPercentage - e.totalPercentage);
        let aG = ((e) => {
            let t = C.bubblemapChainData.find((t) => t.chain_id === e);
            return (null == t ? void 0 : t.analytics_url) && ex
              ? "".concat(t.analytics_url).concat(ex)
              : null;
          })(em),
          aU = (e, t, a) => {
            if (!e) return;
            let s = window.location.origin,
              n = C.bubblemapChainData.find((e) => e.chain_id === a);
            if (n && n.analytics_url) {
              let a = n.analytics_url
                .replace("{baseUrl}", s)
                .replace("{WALLET_ADDRESS}", e);
              t && (a = a.replace("{TOKEN_ADDRESS}", t)),
                window.open(a, "_blank", "noopener,noreferrer");
            } else
              r.Am.error("Not able to find Analytics Page for ".concat(e), {
                containerId: "first",
              });
          },
          aK = (e) => {
            if (tV.current) {
              let t = tV.current.querySelector("#node-".concat(e));
              if (t) {
                let e = tV.current.getBoundingClientRect(),
                  a = t.getBoundingClientRect(),
                  s =
                    a.top -
                    e.top +
                    tV.current.scrollTop -
                    e.height / 2 +
                    a.height / 2;
                tV.current.scrollTo({
                  top: s,
                  behavior: "smooth",
                });
              }
            }
          },
          aJ = (e) => {
            var t;
            let a;
            let { tokenData: n, node: l, onClose: i, onCenter: o } = e;
            if (!l) return null;
            let c = t6.includes(l.index),
              d = V(l.address, e0.nodes, e4, e6),
              x =
                ((a = l.index),
                null == e0
                  ? void 0
                  : e0.links.some((e) => {
                      let t =
                          "object" == typeof e.source
                            ? e.source.index
                            : e.source,
                        s =
                          "object" == typeof e.target
                            ? e.target.index
                            : e.target,
                        n = t === a || s === a,
                        l = t6.includes(t) || t6.includes(s);
                      return n && !l;
                    })),
              m =
                (0, p.jw)(
                  l.address,
                  (null == n ? void 0 : n.name.toLowerCase()) || "ethereum"
                ) || l.address,
              u = (e) => {
                let t = document.createElement("textarea");
                (t.value = e),
                  (t.style.position = "fixed"),
                  (t.style.left = "-9999px"),
                  document.body.appendChild(t),
                  t.select();
                try {
                  let e = document.execCommand("copy");
                  console.log(
                    "Fallback: Copying text command was ".concat(
                      e ? "successful" : "unsuccessful"
                    )
                  ),
                    r.Am.success("Address copied", {
                      containerId: "first",
                    });
                } catch (e) {
                  console.error("Fallback: Unable to copy", e),
                    r.Am.error("Couldn't copy address", {
                      containerId: "first",
                    });
                }
                document.body.removeChild(t);
              },
              h = (e) => {
                navigator.clipboard && navigator.clipboard.writeText
                  ? navigator.clipboard
                      .writeText(e)
                      .then(() => {
                        r.Am.success("Address copied", {
                          containerId: "first",
                        });
                      })
                      .catch((t) => {
                        console.error(
                          "Clipboard API failed, trying fallback: ",
                          t
                        ),
                          u(e);
                      })
                  : u(e);
              },
              f = "/api/proxy-logo?address=".concat(
                null == l ? void 0 : l.address
              );
            return (0, s.jsx)("div", {
              className: "fixed ".concat(
                _
                  ? " top-[104px] md:top-[112px] !z-10 flex left-[16px] w-fit min-w-[260px] justify-start"
                  : "bottom-0 left-0 right-0 top-4 !z-10 flex w-full justify-center md:absolute md:bottom-auto md:left-4 md:right-0 md:w-fit md:min-w-[380px] md:justify-start"
              ),
              children: (0, s.jsxs)("div", {
                className: "".concat(
                  _
                    ? "mt-2 w-full max-w-[calc(100%)] rounded-md bg-[#1C2433] p-3 text-white shadow md:m-0 md:w-full md:max-w-[calc(100%)]"
                    : "max-w-[calc(100%] m-2 w-full rounded-md bg-[#1C2433] p-4 text-white shadow-lg md:m-0 md:w-full"
                ),
                children: [
                  (0, s.jsxs)("div", {
                    className: "flex items-start justify-between",
                    children: [
                      (0, s.jsxs)("div", {
                        className: "flex",
                        children: [
                          (0, s.jsx)("img", {
                            src: f,
                            alt: l.name,
                            className: "rounded-full ".concat(
                              _ ? "mr-2 h-[30px] w-[30px]" : "mr-4 h-11 w-11"
                            ),
                          }),
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("h4", {
                                className:
                                  "\n                    mr-4\n                    ".concat(
                                    _
                                      ? "text-xs font-medium leading-snug"
                                      : "text-lg font-semibold leading-snug"
                                  ),
                                children:
                                  l.name && l.name.length > 40
                                    ? "".concat(l.name.substring(0, 40), "...")
                                    : null !== (t = l.name) && void 0 !== t
                                    ? t
                                    : "Unknown",
                              }),
                              (0, s.jsxs)("div", {
                                className: "flex items-center ".concat(
                                  _
                                    ? "text-xxs font-bold leading-none"
                                    : "text-xs font-medium leading-3",
                                  " text-[#6b7280]"
                                ),
                                children: [
                                  (0, s.jsx)("p", {
                                    children: (0, y.ys)(m),
                                  }),
                                  (0, s.jsx)("button", {
                                    className:
                                      "duplicate-filled-gray relative ml-1 h-4 w-4",
                                    onClick: () => h(m),
                                  }),
                                  !_ &&
                                    !aG &&
                                    (0, s.jsx)("button", {
                                      className:
                                        "tooltip-analytics relative ml-1 h-4 w-4",
                                      onClick: (e) => {
                                        e.stopPropagation(),
                                          aU(l.address, ex, em);
                                      },
                                    }),
                                  !_ &&
                                    !t6.includes(l.index) &&
                                    (0, s.jsx)("button", {
                                      className: "search relative ml-1 h-4 w-4",
                                      onClick: (e) => {
                                        e.stopPropagation(), o(l.index);
                                      },
                                    }),
                                  !_ &&
                                    (0, s.jsx)("button", {
                                      onClick: (e) => {
                                        e.stopPropagation(), aC(l.index);
                                      },
                                      className: "ml-1",
                                      children: t6.includes(l.index)
                                        ? (0, s.jsx)("div", {
                                            className:
                                              "tooltip-eyeOff h-4 w-4 text-gray-500 opacity-50",
                                          })
                                        : (0, s.jsx)("div", {
                                            className:
                                              "tooltip-eyeOn h-4 w-4 text-gray-500 ".concat(
                                                tf === l.index
                                                  ? "opacity-100"
                                                  : "opacity-50"
                                              ),
                                          }),
                                    }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, s.jsx)("button", {
                        className: "CloseX-mini relative h-3 w-3",
                        onClick: i,
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className: "".concat(
                      _ ? "mt-2" : "mt-4",
                      " flex flex-wrap gap-2"
                    ),
                    children: [
                      [
                        {
                          prop: "is_burn",
                          label: "Burn",
                        },
                        {
                          prop: "is_lock",
                          label: "Token Lock",
                        },
                        {
                          prop: "is_pair",
                          label: "Pair",
                        },
                        {
                          prop: "is_team",
                          label: "Team",
                        },
                        {
                          prop: "is_proxy",
                          label: "Proxy",
                        },
                        {
                          prop: "is_tax",
                          label: "Tax",
                        },
                        {
                          prop: "is_contract",
                          label: "Smart Contract",
                        },
                        {
                          prop: "is_exchange",
                          label: "Exchange",
                        },
                        {
                          prop: "is_presale",
                          label: "Presale",
                        },
                      ]
                        .filter((e) => {
                          let { prop: t } = e;
                          return l[t];
                        })
                        .map((e) => {
                          let { prop: t, label: a } = e;
                          return (0, s.jsx)(
                            "span",
                            {
                              className: "rounded-full bg-[#374151] ".concat(
                                _
                                  ? "px-[9px] pb-[3px] pt-0.5 text-xxs leading-tight"
                                  : "px-3 py-1 text-xs"
                              ),
                              children: a,
                            },
                            t
                          );
                        }),
                      !l.is_contract &&
                        (0, s.jsx)("span", {
                          className: "rounded-full bg-[#374151] ".concat(
                            _
                              ? "px-[9px] pb-[3px] pt-0.5 text-xxs leading-tight"
                              : "px-3 py-1 text-xs"
                          ),
                          children: "Wallet",
                        }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className: "".concat(
                      _ ? "mt-2" : "mt-4",
                      " flex flex-wrap justify-between gap-2 text-sm font-medium text-gray-400"
                    ),
                    children: [
                      (0, s.jsxs)("div", {
                        className:
                          "flex-1 flex-shrink-0 whitespace-nowrap md:flex-grow ".concat(
                            _ ? "text-left text-xxs" : "text-right text-xs"
                          ),
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-[#6b7280]",
                            children: "Amount",
                          }),
                          (0, s.jsx)("div", {
                            className: "whitespace-nowrap ".concat(
                              l.is_proxy ? "text-[#6b7280]" : "text-white"
                            ),
                            children: "".concat(
                              l.is_proxy
                                ? "-"
                                : ""
                                    .concat(
                                      (0, w.St)(l.amount),
                                      " ",
                                      "\n                "
                                    )
                                    .concat(
                                      null == n
                                        ? void 0
                                        : n.token_metadata.symbol
                                    )
                            ),
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        className:
                          "flex-1 flex-shrink-0 whitespace-nowrap md:flex-grow ".concat(
                            _ ? "text-left text-xxs" : "text-right text-xs"
                          ),
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-[#6b7280]",
                            children: "Value",
                          }),
                          (0, s.jsx)("div", {
                            className: "whitespace-nowrap ".concat(
                              l.is_proxy ? "text-[#6b7280]" : "text-emerald-600"
                            ),
                            children: l.is_proxy
                              ? "-"
                              : "".concat((0, w.xS)(l.amount_usd)),
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        className:
                          "flex-1 flex-shrink-0 whitespace-nowrap md:flex-grow ".concat(
                            _ ? "text-left text-xxs" : "text-right text-xs"
                          ),
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-[#6b7280]",
                            children: "Amount (%)",
                          }),
                          (0, s.jsxs)("div", {
                            className: "whitespace-nowrap text-white",
                            children: [l.percentage.toFixed(2), "%"],
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        className:
                          "flex-1 flex-shrink-0 whitespace-nowrap md:flex-grow ".concat(
                            _ ? "text-left text-xxs" : "text-right text-xs"
                          ),
                        children: [
                          (0, s.jsx)("div", {
                            className: "text-[#6b7280]",
                            children: "Cluster (%)",
                          }),
                          (0, s.jsxs)("div", {
                            className: "whitespace-nowrap text-white",
                            style: {
                              color:
                                "clusters" === tu
                                  ? c
                                    ? "#374151"
                                    : d
                                  : "#FFF",
                            },
                            children: [
                              !c &&
                              "clusters" === tu &&
                              l.clusterPercentage &&
                              x
                                ? l.clusterPercentage.toFixed(2)
                                : l.percentage.toFixed(2),
                              "%",
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            });
          },
          aq = (e, t) => {
            if ("labels" !== tu) return;
            let a = e.map((e) => e0.nodes[e]).filter((e) => e),
              n = eE ? aV(a, eE) : a;
            if (0 === n.length) return null;
            let l = W(t);
            return n
              .filter((e) => !t6.includes(e.index))
              .map((e) =>
                (0, s.jsx)(
                  E,
                  {
                    isIframe: _,
                    node: e,
                    selectedNode: tf,
                    hiddenNodes: t6,
                    categoryColor: l,
                    onClick: aW,
                    toggleNodeVisibility: aC,
                  },
                  e.index
                )
              );
          },
          aY = new Set(
            "labels" === tu
              ? null == tJ
                ? void 0
                : tJ.categories.flatMap((e) => e.nodes)
              : []
          ),
          aZ =
            "labels" === tu
              ? aX
                  .filter((e) => e && !aY.has(e.index))
                  .filter((e) => !t6.includes(e.index))
                  .map((e) =>
                    (0, s.jsx)(
                      E,
                      {
                        isIframe: _,
                        node: e,
                        selectedNode: tf,
                        hiddenNodes: t6,
                        onClick: aW,
                        toggleNodeVisibility: aC,
                      },
                      e.index
                    )
                  )
              : [],
          aQ =
            "labels" === tu
              ? t6
                  .map((e) => e0.nodes[e])
                  .filter((e) => e)
                  .filter((e) => !eE || aV([e], eE).length > 0)
                  .map((e) =>
                    (0, s.jsx)(
                      E,
                      {
                        isIframe: _,
                        node: e,
                        selectedNode: tf,
                        hiddenNodes: t6,
                        onClick: aW,
                        toggleNodeVisibility: aC,
                      },
                      e.index
                    )
                  )
              : [];
        if (!tG && !er.asPath.includes("/bubblemaps/")) return null;
        let a$ =
            eB.symbol && "Loading" !== eB.symbol
              ? "INX Bubblemaps - ".concat(eB.symbol)
              : "INX Bubblemaps",
          a0 = (e) => {
            let t = null == tJ ? void 0 : tJ.nodes.filter((t) => t[e]),
              a = new Set(t6),
              s =
                (null == t || t.some((e) => a.has(e.index)),
                (null == t ? void 0 : t.every((e) => a.has(e.index))) || !1),
              n = "flex "
                .concat(
                  _ || tw ? "h-[26px]" : "h-[30px]",
                  " bg-[#354152] flex-1 items-center justify-center rounded-lg px-2 py-1.5 "
                )
                .concat(_ || tw ? "text-xxs" : "text-xs", " whitespace-nowrap");
            return (
              (null == t ? void 0 : t.length) === 0
                ? (n += "bg-[#354152] text-white opacity-15 cursor-not-allowed")
                : s
                ? (n += "bg-[#354152] text-white opacity-30")
                : (n += "bg-[#354152] text-white"),
              n
            );
          },
          a1 = (e) => {
            let t = null == tJ ? void 0 : tJ.nodes.filter((t) => t[e]),
              a = new Set(t6),
              s = (null == t ? void 0 : t.every((e) => a.has(e.index))) || !1;
            return (null == t ? void 0 : t.length) === 0
              ? "".concat(
                  _ || tw ? "hidden" : "hidden md:flex",
                  " stopWhite h-4 w-4"
                )
              : s
              ? "".concat(_ || tw ? "hidden" : "hidden md:flex eyeOff h-4 w-4")
              : "".concat(_ || tw ? "hidden" : "hidden md:flex eyeOn h-4 w-4");
          };
        (0, i.useEffect)(() => {
          if (
            !er.isReady ||
            !eo ||
            !tJ ||
            !tJ.nodes ||
            0 === tJ.nodes.length ||
            !t4 ||
            es
          )
            return;
          let e = (() => {
            let e = parseInt(eo, 10);
            if (0 === e)
              tx({
                name: "All relationships",
                symbol: "ALL",
                logo: "/icons/all_relationships.png",
                address: "-1",
              });
            else if (1 === e)
              tx({
                name: tJ.name,
                symbol: tJ.symbol,
                logo: tJ.logo,
                address: tJ.address,
              });
            else if (e > 1 && (null == tJ ? void 0 : tJ.token_links)) {
              let t = tJ.token_links[e - 2];
              t
                ? tx({
                    name: t.name,
                    symbol: t.symbol,
                    logo: t.logo,
                    address: t.address,
                  })
                : tx({
                    name: "All relationships",
                    symbol: "ALL",
                    logo: "/icons/all_relationships.png",
                    address: "-1",
                  });
            }
          })();
          return () => clearTimeout(e);
        }, [tJ, eo, t4, es, er.isReady]);
        let a5 = (e, t) => {
            let a = L.decode(e)
              .replace(/[^\x20-\x7E]+/g, "")
              .trim()
              .replace(/\s+/g, " ");
            return a.length > t ? "".concat(a.substring(0, t), "...") : a;
          },
          a2 = (e) => {
            let { count: t = 1 } = e;
            return (0, s.jsx)(s.Fragment, {
              children: Array.from({
                length: t,
              }).map((e, t) =>
                (0, s.jsx)(
                  "div",
                  {
                    className:
                      "mt-[3px] cursor-pointer rounded-lg border-2 border-[#374151] bg-[#3741514D] p-3 text-white",
                    children: (0, s.jsxs)("div", {
                      className: "flex items-center justify-between",
                      children: [
                        (0, s.jsx)("div", {
                          className:
                            "LoadingState--line Rectangle1484 flex h-3 w-7 min-w-[40px] items-center rounded-full bg-gray-700",
                        }),
                        (0, s.jsx)("div", {
                          className:
                            "LoadingState--line Rectangle1484 1 mx-2 h-3 w-7 min-w-[40px] flex-1 items-center rounded-full bg-gray-700",
                        }),
                        (0, s.jsx)("div", {
                          className: "flex items-center",
                          children: (0, s.jsx)("div", {
                            className:
                              "LoadingState--line Rectangle1484 mx-2 h-3 w-[70px] min-w-[40px] flex-1 items-center rounded-full bg-gray-700",
                          }),
                        }),
                      ],
                    }),
                  },
                  t
                )
              ),
            });
          },
          [a4, a3] = (0, i.useState)("Select Snapshot");
        (0, i.useEffect)(() => {
          if (!tU) return;
          let e = () => {
            a3(z(tU, _));
          };
          if ((e(), _)) {
            let t = setInterval(e, 5e3);
            return () => clearInterval(t);
          }
        }, [tU, P]);
        let a6 = _
            ? "fixed inset-0 h-full w-full bg-gray-900"
            : "md:max-w-custom md:max-h-custom md:xy-16 relative mx-0 my-0 h-full w-full overflow-hidden border-slate-800 bg-gray-900 shadow-xl md:mx-16 md:rounded-lg md:border-2",
          a7 = "bg-[#1C2433]";
        return (0, s.jsxs)("div", {
          className:
            "fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75",
          onClick: _ ? void 0 : aB,
          children: [
            (0, s.jsx)(F.Z, {
              baseTitle: a$,
            }),
            (0, s.jsxs)("div", {
              className: a6,
              onClick: (e) => e.stopPropagation(),
              children: [
                (0, s.jsxs)("div", {
                  className: "".concat(
                    _ ? "hidden" : "hidden md:flex",
                    " relative z-51 h-full items-center rounded-t-none bg-slate-800 px-1 py-1 shadow-md md:h-20 md:flex-row md:rounded-t-sm md:px-8 md:py-4"
                  ),
                  children: [
                    (0, s.jsxs)("div", {
                      className:
                        "relative flex min-w-[250px] items-center gap-4",
                      children: [
                        "" !== eB.logo &&
                        "Loading" !== eB.logo &&
                        null !== eB.logo
                          ? (0, s.jsxs)("div", {
                              className:
                                "relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-700",
                              children: [
                                (0, s.jsx)("img", {
                                  src: eB.logo,
                                  alt: eB.name,
                                  className:
                                    "h-full w-full rounded-full object-cover",
                                }),
                                eB.chainLogo &&
                                  (0, s.jsx)("div", {
                                    className:
                                      "absolute bottom-0 left-0 h-4 w-4 rounded-full bg-gray-700",
                                    children: (0, s.jsx)("img", {
                                      src: eB.chainLogo,
                                      alt: "Chain Logo",
                                      className:
                                        "h-full w-full rounded-full object-cover",
                                    }),
                                  }),
                              ],
                            })
                          : null === eB.logo && eB.symbol && "" !== eB.symbol
                          ? (0, s.jsxs)("div", {
                              className:
                                "relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-700",
                              children: [
                                (0, s.jsx)("span", {
                                  className: "text-sm text-white",
                                  children: eB.symbol.substring(0, 3),
                                }),
                                eB.chainLogo &&
                                  (0, s.jsx)("div", {
                                    className:
                                      "absolute bottom-0 left-0 h-4 w-4 rounded-full bg-gray-700",
                                    children: (0, s.jsx)("img", {
                                      src: eB.chainLogo,
                                      alt: "Chain Logo",
                                      className:
                                        "h-full w-full rounded-full object-cover",
                                    }),
                                  }),
                              ],
                            })
                          : (0, s.jsx)("div", {
                              className:
                                "flex h-12 w-12 items-center justify-center rounded-full bg-gray-700",
                            }),
                        es
                          ? (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("div", {
                                  className:
                                    "LoadingState--line--InBox StatsBadge mb-1 h-6 w-36 rounded-xl bg-gray-700 px-1 py-0.5",
                                }),
                                (0, s.jsx)("div", {
                                  className: "flex items-center gap-2",
                                  children: (0, s.jsx)("div", {
                                    className:
                                      "LoadingState--line--InBox StatsBadge h-4 w-24 rounded-xl bg-gray-700 px-1 py-0.5",
                                  }),
                                }),
                              ],
                            })
                          : (0, s.jsxs)("div", {
                              className: "flex flex-col",
                              children: [
                                (0, s.jsx)("div", {
                                  className: "text-xl font-semibold text-white",
                                  children: a5(eB.name, 30),
                                }),
                                (0, s.jsxs)("div", {
                                  className: "flex items-center",
                                  children: [
                                    (0, s.jsx)("div", {
                                      className:
                                        "text-center font-['Inter'] text-sm font-semibold leading-none text-white",
                                      children: eB.symbol,
                                    }),
                                    (0, s.jsxs)("button", {
                                      className:
                                        "ml-2 flex items-center font-['Inter'] text-sm font-normal leading-3 text-slate-500",
                                      onClick: () => {
                                        navigator.clipboard
                                          .writeText(H || "")
                                          .then(() => {
                                            r.Am.success(
                                              "Copied to clipboard",
                                              {
                                                containerId: "first",
                                              }
                                            );
                                          });
                                      },
                                      children: [
                                        (0, s.jsxs)("span", {
                                          children: [
                                            H.slice(0, 6),
                                            "...",
                                            H.slice(-4),
                                          ],
                                        }),
                                        (0, s.jsx)("div", {
                                          className:
                                            "duplicate-filled-gray relative ml-1 h-4 w-4",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "relative ml-6 flex items-center gap-4",
                      children: [
                        (0, s.jsxs)("div", {
                          className:
                            "min-w-[150px] flex-col items-start md:flex",
                          children: [
                            (0, s.jsxs)("div", {
                              className:
                                "mb-1 flex items-center text-xs text-gray-400",
                              children: [
                                "Snapshot",
                                (0, s.jsx)("div", {
                                  className:
                                    "QuestionMarkCircle relative ml-2 h-5 w-5",
                                  "data-tooltip-id": "timestamp-snapshot",
                                  "data-tooltip-html": v.renderToStaticMarkup(
                                    (0, s.jsx)(j.sk, {
                                      description: "".concat(
                                        "View existing snapshots or generate your own"
                                      ),
                                    })
                                  ),
                                }),
                              ],
                            }),
                            (0, s.jsx)("button", {
                              ref: ao,
                              className: "relative flex items-center gap-2",
                              onClick: aO,
                              children: (0, s.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  (0, s.jsx)("div", {
                                    className:
                                      "snapshotCalender h-6 w-6 rounded-full",
                                  }),
                                  (0, s.jsx)("div", {
                                    className:
                                      "whitespace-nowrap text-sm text-white",
                                    children: tU ? a4 : "Select Snapshot",
                                  }),
                                  (0, s.jsx)("div", {
                                    className: "chevron_down h-5 w-5",
                                  }),
                                ],
                              }),
                            }),
                            e_ &&
                              (0, s.jsx)(m, {
                                isIframe: _,
                                snapshots: te,
                                onSnapshotClick: aF,
                                selectedTimestamp: tU,
                                BubblemapEnabled: ae,
                                searchAddress: H,
                                accessLevel: ew,
                                onDataGenerated: aE,
                                setIsGenerating: as,
                                isGenerating: aa,
                                chainId: em,
                                isWhitelisted: ef,
                                setDropdownOpen: eS,
                                disableProxy: Z,
                                clearTimeouts: aT,
                                referrer: S,
                              }),
                          ],
                        }),
                        (0, s.jsxs)("div", {
                          className:
                            "min-w-[150px] flex-col items-start md:flex",
                          children: [
                            (0, s.jsxs)("div", {
                              className:
                                "mb-1 flex items-center text-xs text-gray-400",
                              children: [
                                "Relationship",
                                (0, s.jsx)("div", {
                                  className:
                                    "QuestionMarkCircle relative ml-2 h-5 w-5",
                                  "data-tooltip-id": "bubblemap-snapshot",
                                  "data-tooltip-html": v.renderToStaticMarkup(
                                    (0, s.jsx)(j.sk, {
                                      description: "".concat(
                                        "View relationships between addresses for the selected token."
                                      ),
                                    })
                                  ),
                                }),
                              ],
                            }),
                            (0, s.jsx)("button", {
                              ref: ac,
                              className: "relative flex items-center gap-2",
                              onClick: ap,
                              children: (0, s.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  (0, s.jsxs)("div", {
                                    className: "relative h-6 w-6",
                                    children: [
                                      (0, s.jsx)("div", {
                                        className:
                                          "absolute inset-0 flex items-center justify-center rounded-full bg-gray-700 text-xxxs font-semibold text-gray-700",
                                        children: td.symbol
                                          ? td.symbol.slice(0, 3)
                                          : "N/A",
                                      }),
                                      td.logo &&
                                        !tz &&
                                        (0, s.jsx)("img", {
                                          src: td.logo,
                                          alt: td.name,
                                          className:
                                            "absolute inset-0 h-6 w-6 rounded-full object-cover",
                                          onError: () => tW(!0),
                                        }),
                                    ],
                                  }),
                                  (0, s.jsx)("div", {
                                    className:
                                      "whitespace-nowrap text-sm text-white",
                                    children: td.name
                                      ? td.name
                                      : "Select Token",
                                  }),
                                  (0, s.jsx)("div", {
                                    className: "chevron_down h-5 w-5",
                                  }),
                                ],
                              }),
                            }),
                            eC &&
                              (0, s.jsx)("div", {
                                className:
                                  "absolute top-full z-51 mt-[10px] max-h-[320px] overflow-y-auto min-w-[18rem] flex-col items-start justify-start rounded-md bg-white py-1 shadow",
                                children: (0, s.jsx)("div", {
                                  className: "px-1 py-1",
                                  children:
                                    (null == tJ ? void 0 : tJ.name) ||
                                    ((null == tJ ? void 0 : tJ.token_links) &&
                                      0 !== tJ.token_links.length)
                                      ? (0, s.jsxs)(s.Fragment, {
                                          children: [
                                            (0, s.jsxs)("button", {
                                              className:
                                                "mt-1 flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm ".concat(
                                                  "ALL" === td.symbol
                                                    ? "bg-gray-100 text-gray-700"
                                                    : "bg-white text-gray-700"
                                                ),
                                              onClick: () => {
                                                aD(
                                                  {
                                                    logo: "/icons/all_relationships.png",
                                                    name: "All relationships",
                                                    symbol: "ALL",
                                                    address: "-1",
                                                  },
                                                  0
                                                );
                                              },
                                              children: [
                                                (0, s.jsx)("img", {
                                                  src: "/icons/all_relationships.png",
                                                  alt: "All",
                                                  className:
                                                    "h-6 w-6 rounded-full",
                                                  onError: () => tH(index),
                                                }),
                                                (0, s.jsxs)("div", {
                                                  className: "flex flex-col",
                                                  children: [
                                                    (0, s.jsx)("span", {
                                                      className:
                                                        "text-sm font-semibold leading-tight text-gray-700",
                                                      children:
                                                        "All relationships",
                                                    }),
                                                    (0, s.jsx)("div", {
                                                      className:
                                                        "flex items-center",
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            (null == tJ ? void 0 : tJ.name) &&
                                              (null == tJ
                                                ? void 0
                                                : tJ.symbol) &&
                                              (0, s.jsxs)(
                                                "button",
                                                {
                                                  className:
                                                    "flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm ".concat(
                                                      td.symbol === tJ.symbol
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "bg-white text-gray-700",
                                                      " "
                                                    ),
                                                  onClick: () =>
                                                    aD(
                                                      {
                                                        logo: tJ.logo,
                                                        name: tJ.name,
                                                        symbol: tJ.symbol,
                                                        address: tJ.address,
                                                        links: tJ.links,
                                                      },
                                                      1
                                                    ),
                                                  children: [
                                                    tJ.logo && !tO
                                                      ? (0, s.jsx)("img", {
                                                          src: tJ.logo,
                                                          alt: tJ.name,
                                                          className:
                                                            "h-6 w-6 rounded-full",
                                                          onError: () => tR(!0),
                                                        })
                                                      : (0, s.jsx)("div", {
                                                          className:
                                                            "flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xxxs font-semibold text-gray-700",
                                                          children: tJ.symbol
                                                            ? tJ.symbol.slice(
                                                                0,
                                                                3
                                                              )
                                                            : "N/A",
                                                        }),
                                                    (0, s.jsxs)("div", {
                                                      className:
                                                        "flex flex-col",
                                                      children: [
                                                        (0, s.jsx)("span", {
                                                          className:
                                                            "text-sm font-semibold leading-tight text-gray-700",
                                                          children: tJ.name,
                                                        }),
                                                        (0, s.jsx)("span", {
                                                          className:
                                                            "text-xxs font-semibold text-gray-700",
                                                          children: tJ.symbol,
                                                        }),
                                                        (0, s.jsx)("div", {
                                                          className:
                                                            "flex items-center",
                                                        }),
                                                      ],
                                                    }),
                                                  ],
                                                },
                                                tJ.symbol
                                              ),
                                            (null == tJ
                                              ? void 0
                                              : tJ.token_links) &&
                                              tJ.token_links.length > 0 &&
                                              tJ.token_links.map((e, t) =>
                                                (0, s.jsxs)(
                                                  "button",
                                                  {
                                                    className:
                                                      "flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm ".concat(
                                                        td.symbol === e.symbol
                                                          ? "bg-gray-100 text-gray-700"
                                                          : "bg-white text-gray-700"
                                                      ),
                                                    onClick: () => aD(e, t + 2),
                                                    children: [
                                                      e.logo && !tP[t]
                                                        ? (0, s.jsx)("img", {
                                                            src: e.logo,
                                                            alt: e.name,
                                                            className:
                                                              "h-6 w-6 rounded-full",
                                                            onError: () =>
                                                              tH(t),
                                                          })
                                                        : (0, s.jsx)("div", {
                                                            className:
                                                              "flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xxxs font-semibold text-gray-700",
                                                            children: e.symbol
                                                              ? e.symbol.slice(
                                                                  0,
                                                                  3
                                                                )
                                                              : "N/A",
                                                          }),
                                                      (0, s.jsxs)("div", {
                                                        className:
                                                          "flex flex-col",
                                                        children: [
                                                          (0, s.jsx)("span", {
                                                            className:
                                                              "text-sm font-semibold leading-tight text-gray-700",
                                                            children: e.name,
                                                          }),
                                                          (0, s.jsxs)("div", {
                                                            className:
                                                              "flex items-center",
                                                            children: [
                                                              (0, s.jsx)(
                                                                "span",
                                                                {
                                                                  className:
                                                                    "text-xxs font-semibold text-gray-700",
                                                                  children:
                                                                    e.symbol,
                                                                }
                                                              ),
                                                              (0, s.jsx)(
                                                                "span",
                                                                {
                                                                  className:
                                                                    "ml-2 text-xxs font-semibold text-gray-400",
                                                                  style: {
                                                                    textOverflow:
                                                                      "ellipsis",
                                                                    whiteSpace:
                                                                      "nowrap",
                                                                    overflow:
                                                                      "hidden",
                                                                    maxWidth:
                                                                      "100px",
                                                                  },
                                                                  children: (0,
                                                                  y.ys)(
                                                                    e.address
                                                                  ),
                                                                }
                                                              ),
                                                            ],
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  },
                                                  e.symbol
                                                )
                                              ),
                                          ],
                                        })
                                      : (0, s.jsx)("div", {
                                          className:
                                            "px-4 py-2 text-sm text-gray-700",
                                          children: "No data",
                                        }),
                                }),
                              }),
                          ],
                        }),
                        1e3 === ew &&
                          ev &&
                          (0, s.jsx)("button", {
                            className:
                              "min-w-[150px] flex-col items-start md:flex",
                            onClick: ab,
                            children: (0, s.jsx)("div", {
                              className:
                                "mb-1 flex items-center text-xs text-gray-400",
                              children: (0, s.jsx)("div", {
                                className:
                                  "trashcangray ml-2 h-5 w-5 text-gray-400",
                              }),
                            }),
                          }),
                      ],
                    }),
                    (0, s.jsx)(N.u, {
                      disableStyleInjection: !0,
                      id: "timestamp-snapshot",
                      opacity: 1,
                      style: {
                        zIndex: "1000",
                      },
                    }),
                    (0, s.jsx)(N.u, {
                      disableStyleInjection: !0,
                      id: "bubblemap-snapshot",
                      opacity: 1,
                      style: {
                        zIndex: "1000",
                      },
                    }),
                    (0, s.jsx)("div", {
                      className: "flex-grow",
                    }),
                    (0, s.jsxs)("div", {
                      className: "flex items-center",
                      children: [
                        (0, s.jsx)("div", {
                          className: "mr-8 text-center",
                          children: ef
                            ? (0, s.jsx)("a", {
                                href: "https://forms.gle/wmRTxnyLpCD4V5Ro8",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className:
                                  "text-sm font-semibold text-yellow-500",
                                children: "Token is listed",
                              })
                            : (0, s.jsx)("a", {
                                href: "https://forms.gle/wmRTxnyLpCD4V5Ro8",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className:
                                  "text-sm font-semibold text-gray-500 hover:text-gray-400",
                                children: "List Token",
                              }),
                        }),
                        (0, s.jsx)("button", {
                          onClick: _ ? void 0 : aB,
                          className: "bubblemap-closeX relative h-6 w-6",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className:
                    "absolute pointer-events-none left-0 top-0 z-20 m-2 flex flex-col gap-2 p-2 ".concat(
                      _ ? "flex" : "flex md:hidden"
                    ),
                  children: [
                    !tI &&
                      (0, s.jsxs)("div", {
                        className: "flex flex-row gap-2",
                        children: [
                          (0, s.jsx)("div", {
                            className: "interactive-element-class flex ".concat(
                              eu
                                ? "p-4 pt-3 pb-3 max-h-[120px]"
                                : "p-2 max-h-[40px]",
                              " w-fit min-w-[100px] items-center justify-center rounded-lg bg-[#1C2433]  text-white shadow"
                            ),
                            children: (0, s.jsxs)("div", {
                              className:
                                "relative pointer-events-auto mr-2 flex items-center ".concat(
                                  eu ? "gap-4" : "gap-2"
                                ),
                              children: [
                                "" !== eB.logo &&
                                "Loading" !== eB.logo &&
                                null !== eB.logo
                                  ? (0, s.jsxs)("div", {
                                      className: "relative flex ".concat(
                                        eu ? "h-14 w-14" : "h-7 w-7",
                                        " items-center justify-center rounded-full bg-gray-700"
                                      ),
                                      children: [
                                        (0, s.jsx)("img", {
                                          src: eB.logo,
                                          alt: eB.name,
                                          className:
                                            "h-full w-full rounded-full object-cover",
                                        }),
                                        eB.chainLogo &&
                                          (0, s.jsx)("div", {
                                            className:
                                              "absolute bottom-0 left-0 ".concat(
                                                eu ? "h-6 w-6" : "h-3 w-3",
                                                " rounded-full bg-gray-700"
                                              ),
                                            children: (0, s.jsx)("img", {
                                              src: eB.chainLogo,
                                              alt: "Chain Logo",
                                              className:
                                                "h-full w-full rounded-full object-cover",
                                            }),
                                          }),
                                      ],
                                    })
                                  : null === eB.logo &&
                                    eB.symbol &&
                                    "" !== eB.symbol
                                  ? (0, s.jsxs)("div", {
                                      className: "relative flex ".concat(
                                        eu ? "h-10 w-10" : "h-7 w-7",
                                        " items-center justify-center rounded-full bg-gray-700"
                                      ),
                                      children: [
                                        (0, s.jsx)("span", {
                                          className:
                                            "whitespace-nowrap text-xxxs text-white",
                                          children: eB.symbol.substring(0, 3),
                                        }),
                                        eB.chainLogo &&
                                          (0, s.jsx)("div", {
                                            className:
                                              "absolute bottom-0 left-0 ".concat(
                                                eu ? "h-6 w-6" : "h-3 w-3",
                                                " rounded-full bg-gray-700"
                                              ),
                                            children: (0, s.jsx)("img", {
                                              src: eB.chainLogo,
                                              alt: "Chain Logo",
                                              className:
                                                "h-full w-full rounded-full object-cover",
                                            }),
                                          }),
                                      ],
                                    })
                                  : (0, s.jsx)(s.Fragment, {
                                      children:
                                        !es &&
                                        (0, s.jsxs)("div", {
                                          className:
                                            "flex items-center justify-between",
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                "mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-700",
                                            }),
                                            (0, s.jsxs)("div", {
                                              className: "flex flex-col",
                                              children: [
                                                (0, s.jsx)("div", {
                                                  className:
                                                    "LoadingState--line--InBox StatsBadge mb-1 h-3 w-20 rounded-xl bg-gray-700 px-1 py-0.5",
                                                }),
                                                (0, s.jsx)("div", {
                                                  className:
                                                    "flex items-center gap-2",
                                                  children: (0, s.jsx)("div", {
                                                    className:
                                                      "LoadingState--line--InBox StatsBadge h-2 w-12 rounded-xl bg-gray-700 px-1 py-0.5",
                                                  }),
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                    }),
                                es
                                  ? (0, s.jsxs)("div", {
                                      className:
                                        "flex items-center justify-between",
                                      children: [
                                        (0, s.jsx)("div", {
                                          className:
                                            "mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-700",
                                        }),
                                        (0, s.jsxs)("div", {
                                          className: "flex flex-col",
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                "LoadingState--line--InBox StatsBadge mb-1 h-3 w-20 rounded-xl bg-gray-700 px-1 py-0.5",
                                            }),
                                            (0, s.jsx)("div", {
                                              className:
                                                "flex items-center gap-2",
                                              children: (0, s.jsx)("div", {
                                                className:
                                                  "LoadingState--line--InBox StatsBadge h-2 w-12 rounded-xl bg-gray-700 px-1 py-0.5",
                                              }),
                                            }),
                                          ],
                                        }),
                                      ],
                                    })
                                  : (0, s.jsxs)("div", {
                                      className: "flex flex-col",
                                      children: [
                                        (0, s.jsx)("div", {
                                          className:
                                            "flex items-center ".concat(
                                              eu ? "text-2xl" : "text-xs",
                                              " font-semibold text-white"
                                            ),
                                          children: a5(eB.name, tS ? 7 : 20),
                                        }),
                                        (0, s.jsx)("div", {
                                          className: "flex items-center",
                                          children: (0, s.jsx)("div", {
                                            className:
                                              "text-center font-['Inter'] ".concat(
                                                eu ? "text-lg" : "text-xxs",
                                                " font-semibold leading-none text-[#6b7280]"
                                              ),
                                            children: tS
                                              ? a5(eB.symbol, 7)
                                              : eB.symbol,
                                          }),
                                        }),
                                      ],
                                    }),
                              ],
                            }),
                          }),
                          !tk &&
                            !eu &&
                            (0, s.jsx)("div", {
                              className:
                                "pointer-events-auto flex max-h-[40px] w-[40px] items-center justify-center rounded-lg bg-[#1C2433] text-white shadow",
                              children: eb
                                ? (0, s.jsx)(s.Fragment, {
                                    children: (0, s.jsx)("div", {
                                      className:
                                        "LoadingState--line StatsBadge h-full w-full rounded-md bg-gray-700",
                                    }),
                                  })
                                : (0, s.jsx)(s.Fragment, {
                                    children:
                                      ef && !eb
                                        ? (0, s.jsx)("div", {
                                            className:
                                              "bubblemap-listed relative flex h-3 w-3 items-center justify-center p-2",
                                          })
                                        : (0, s.jsx)("div", {
                                            className:
                                              "bubblemap-listed greyscale relative flex h-3 w-3 items-center justify-center p-2",
                                          }),
                                  }),
                            }),
                        ],
                      }),
                    (0, s.jsxs)("div", {
                      className:
                        "pointer-events-auto interactive-element-class relative flex flex-row gap-2 flex-wrap",
                      children: [
                        (0, s.jsxs)("div", {
                          className:
                            "relative flex flex-1 flex-col items-start",
                          children: [
                            (0, s.jsxs)("button", {
                              className: "flex ".concat(
                                eu
                                  ? "p-4 pt-1 pb-3 max-h-[120px] text-[#6b7280]"
                                  : "p-2 max-h-[40px] bg-[#1C2433] text-white",
                                " w-fit min-w-[100px] gap-2 items-center justify-center rounded-lg shadow"
                              ),
                              ref: ao,
                              onClick: aO,
                              children: [
                                (0, s.jsx)("div", {
                                  className: "snapshotCalender ".concat(
                                    eu ? "h-10 w-10" : "h-6 w-6",
                                    " rounded-full"
                                  ),
                                }),
                                (0, s.jsx)("div", {
                                  className: "whitespace-nowrap ".concat(
                                    eu
                                      ? "text-lg text-[#6b7280]"
                                      : "text-xs text-white",
                                    " font-semibold "
                                  ),
                                  children: tU ? z(tU, _, !0) : "Snapshot",
                                }),
                                !eu &&
                                  (0, s.jsx)("div", {
                                    className: "chevron_down_gray  h-5 w-5 ",
                                  }),
                              ],
                            }),
                            e_ &&
                              (0, s.jsx)(m, {
                                isIframe: _,
                                snapshots: te,
                                onSnapshotClick: aF,
                                selectedTimestamp: tU,
                                BubblemapEnabled: ae,
                                searchAddress: H,
                                accessLevel: ew,
                                onDataGenerated: aE,
                                setIsGenerating: as,
                                isGenerating: aa,
                                chainId: em,
                                isWhitelisted: ef,
                                setDropdownOpen: eS,
                                disableProxy: Z,
                                clearTimeouts: aT,
                                referrer: S,
                              }),
                          ],
                        }),
                        !tS &&
                          !eu &&
                          (0, s.jsxs)("div", {
                            className:
                              "pointer-events-auto interactive-element-class relative flex flex-1 flex-col items-start",
                            children: [
                              (0, s.jsxs)("button", {
                                className:
                                  "flex max-h-[40px] w-fit min-w-[100px] items-center justify-center gap-2 rounded-lg bg-[#1C2433] p-2 text-white shadow",
                                ref: ac,
                                onClick: ap,
                                children: [
                                  (0, s.jsxs)("div", {
                                    className: "relative h-6 w-6",
                                    children: [
                                      (0, s.jsx)("div", {
                                        className:
                                          "absolute inset-0 flex items-center justify-center rounded-full bg-gray-700 text-xxxs font-semibold text-white",
                                        children: td.symbol.slice(0, 3),
                                      }),
                                      td.logo &&
                                        !tz &&
                                        (0, s.jsx)("img", {
                                          src: td.logo,
                                          alt: td.name,
                                          className:
                                            "absolute inset-0 h-6 w-6 rounded-full object-cover",
                                          onError: () => tW(!0),
                                        }),
                                    ],
                                  }),
                                  (0, s.jsx)("div", {
                                    className:
                                      "whitespace-nowrap text-xs font-semibold text-white",
                                    children: td.symbol ? td.symbol : "Token",
                                  }),
                                  (0, s.jsx)("div", {
                                    className: "chevron_down_gray h-5 w-5",
                                  }),
                                ],
                              }),
                              eC &&
                                (0, s.jsx)("div", {
                                  className:
                                    "absolute left-0 top-full max-h-[300px] overflow-y-auto z-50 mt-2 min-w-[170px] rounded-md bg-white py-1 shadow-lg",
                                  children: (0, s.jsx)("div", {
                                    className: "px-1 py-1",
                                    children:
                                      (null == tJ ? void 0 : tJ.name) ||
                                      ((null == tJ ? void 0 : tJ.token_links) &&
                                        0 !== tJ.token_links.length)
                                        ? (0, s.jsxs)(s.Fragment, {
                                            children: [
                                              (0, s.jsxs)("button", {
                                                className:
                                                  "mt-1 flex items-center gap-2 rounded-md px-4 py-2 text-left text-sm ".concat(
                                                    "ALL" === td.symbol
                                                      ? "bg-gray-100 text-gray-700"
                                                      : "bg-white text-gray-700"
                                                  ),
                                                style: {
                                                  minWidth: "170px",
                                                  width: "100%",
                                                },
                                                onClick: () => {
                                                  aD(
                                                    {
                                                      logo: "/icons/all_relationships.png",
                                                      name: "All",
                                                      symbol: "ALL",
                                                      address: tJ.address,
                                                    },
                                                    0
                                                  );
                                                },
                                                children: [
                                                  (0, s.jsx)("img", {
                                                    src: "/icons/all_relationships.png",
                                                    alt: "All",
                                                    className:
                                                      "h-6 w-6 rounded-full",
                                                    onError: () => tH(index),
                                                  }),
                                                  (0, s.jsx)("div", {
                                                    className: "flex flex-col",
                                                    children: (0, s.jsx)(
                                                      "span",
                                                      {
                                                        className:
                                                          "whitespace-nowrap text-xs font-semibold leading-tight text-gray-700",
                                                        children:
                                                          "All relationships",
                                                      }
                                                    ),
                                                  }),
                                                ],
                                              }),
                                              (null == tJ ? void 0 : tJ.name) &&
                                                (null == tJ
                                                  ? void 0
                                                  : tJ.symbol) &&
                                                (0, s.jsxs)(
                                                  "button",
                                                  {
                                                    className:
                                                      "flex items-center gap-2 rounded-md px-4 py-2 text-left text-sm ".concat(
                                                        td.symbol === tJ.symbol
                                                          ? "bg-gray-100 text-gray-700"
                                                          : "bg-white text-gray-700"
                                                      ),
                                                    style: {
                                                      minWidth: "170px",
                                                      width: "100%",
                                                    },
                                                    onClick: () =>
                                                      aD(
                                                        {
                                                          logo: tJ.logo,
                                                          name: tJ.name,
                                                          symbol: tJ.symbol,
                                                          address: tJ.address,
                                                          links: tJ.links,
                                                        },
                                                        1
                                                      ),
                                                    children: [
                                                      tJ.logo && !tO
                                                        ? (0, s.jsx)("img", {
                                                            src: tJ.logo,
                                                            alt: tJ.name,
                                                            className:
                                                              "h-6 w-6 rounded-full",
                                                            onError: () =>
                                                              tR(!0),
                                                          })
                                                        : (0, s.jsx)("div", {
                                                            className:
                                                              "flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xxxs font-semibold text-gray-700",
                                                            children:
                                                              tJ.symbol.slice(
                                                                0,
                                                                3
                                                              ),
                                                          }),
                                                      (0, s.jsxs)("div", {
                                                        className:
                                                          "flex flex-col",
                                                        children: [
                                                          (0, s.jsx)("span", {
                                                            className:
                                                              "whitespace-nowrap text-xs font-semibold leading-tight text-gray-700",
                                                            children: tJ.name,
                                                          }),
                                                          (0, s.jsx)("span", {
                                                            className:
                                                              "whitespace-nowrap text-xxs font-semibold text-gray-700",
                                                            children: tJ.symbol,
                                                          }),
                                                        ],
                                                      }),
                                                    ],
                                                  },
                                                  tJ.symbol
                                                ),
                                              (null == tJ
                                                ? void 0
                                                : tJ.token_links) &&
                                                tJ.token_links.length > 0 &&
                                                tJ.token_links.map((e, t) =>
                                                  (0, s.jsxs)(
                                                    "button",
                                                    {
                                                      className:
                                                        "flex items-center gap-2 rounded-md px-4 py-2 text-left text-sm ".concat(
                                                          td.symbol === e.symbol
                                                            ? "bg-gray-100 text-gray-700"
                                                            : "bg-white text-gray-700"
                                                        ),
                                                      style: {
                                                        minWidth: "170px",
                                                        width: "100%",
                                                      },
                                                      onClick: () =>
                                                        aD(e, t + 2),
                                                      children: [
                                                        e.logo && !tP[t]
                                                          ? (0, s.jsx)("img", {
                                                              src: e.logo,
                                                              alt: e.name,
                                                              className:
                                                                "h-6 w-6 rounded-full",
                                                              onError: () =>
                                                                tH(t),
                                                            })
                                                          : (0, s.jsx)("div", {
                                                              className:
                                                                "flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xxxs font-semibold text-gray-700",
                                                              children:
                                                                e.symbol.slice(
                                                                  0,
                                                                  3
                                                                ),
                                                            }),
                                                        (0, s.jsxs)("div", {
                                                          className:
                                                            "flex flex-col",
                                                          children: [
                                                            (0, s.jsx)("span", {
                                                              className:
                                                                "whitespace-nowrap text-xs font-semibold leading-tight text-gray-700",
                                                              children: e.name,
                                                            }),
                                                            (0, s.jsx)("div", {
                                                              className:
                                                                "flex items-center",
                                                              children: (0,
                                                              s.jsx)("span", {
                                                                className:
                                                                  "whitespace-nowrap text-xxs font-semibold text-gray-700",
                                                                children:
                                                                  e.symbol,
                                                              }),
                                                            }),
                                                          ],
                                                        }),
                                                      ],
                                                    },
                                                    e.symbol
                                                  )
                                                ),
                                            ],
                                          })
                                        : (0, s.jsx)("div", {
                                            className:
                                              "px-4 py-2 text-sm text-gray-700",
                                            children: "No data",
                                          }),
                                  }),
                                }),
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsx)("div", {
                  className: "absolute bottom-0 left-0 z-10 m-2 p-2",
                  children: (0, s.jsx)("div", {
                    className: "flex items-center justify-center",
                    children: (0, s.jsx)("img", {
                      src: "/icons/svg/InsightxLogo-white.svg",
                      className: "cursor-pointer opacity-60 ".concat(
                        eu ? "h-[30px]" : tS ? "max-h-[14px]" : "max-h-[18px]",
                        " md:max-h-[22px] transition-opacity duration-100 ease-in-out hover:opacity-100"
                      ),
                      onClick: () =>
                        _
                          ? window.open(window.location.href, "_blank")
                          : window.open("https://insightx.network/", "_blank"),
                    }),
                  }),
                }),
                (0, s.jsxs)("div", {
                  className: "relative flex h-full flex-row",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "relative flex-grow",
                      children: [
                        eW &&
                          (0, s.jsx)("div", {
                            style: {
                              position: "absolute",
                              top: "-10%",
                              left: tb ? "-10%" : "0%",
                              width: "100%",
                              height: "110%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 5,
                            },
                            children: (0, s.jsx)(I.Z, {
                              size: 150,
                              speedMultiplier: 4,
                              color: "#374151",
                            }),
                          }),
                        tJ &&
                          (null == e0 ? void 0 : e0.nodes.length) > 0 &&
                          t4 &&
                          eR &&
                          aw.current &&
                          (0, s.jsxs)(s.Fragment, {
                            children: [
                              (0, s.jsx)(b, {
                                ref: eZ,
                                data: e0,
                                highlightedNode: tf,
                                onNodeClick: (e) => {
                                  e4[e], eI(!1), eS(!1), tg(e), aK(e);
                                },
                                nodeToCluster: e4,
                                clusterAssignments: e6,
                                hiddenNodes: t6,
                                clustersComplete: t4,
                                secondView: tu,
                                categories:
                                  (null == tJ ? void 0 : tJ.categories) || [],
                                filterCheckComplete: eR || !1,
                                onBigSimulationComplete: () => {
                                  eM(!1);
                                },
                                onSmallSimulationComplete: () => {
                                  eV(!1);
                                },
                                showSmallSpinner: eD,
                                menuOpen: tb,
                                isIframe: _,
                                freeze: av.current,
                              }),
                              null !== tf &&
                                e0.nodes[tf] &&
                                (_ && ep
                                  ? (0, s.jsx)(s.Fragment, {
                                      children: (0, s.jsx)("div", {
                                        className: "block",
                                        children: (0, s.jsx)(aJ, {
                                          tokenData: tJ,
                                          node: e0.nodes[tf],
                                          onClose: () => tg(null),
                                          onCenter: () => aP(e0.nodes[tf]),
                                        }),
                                      }),
                                    })
                                  : (0, s.jsxs)(s.Fragment, {
                                      children: [
                                        (0, s.jsx)("div", {
                                          className: "hidden md:block",
                                          children: (0, s.jsx)(aJ, {
                                            tokenData: tJ,
                                            node: e0.nodes[tf],
                                            onClose: () => tg(null),
                                            onCenter: () => aP(e0.nodes[tf]),
                                          }),
                                        }),
                                        (0, s.jsx)("div", {
                                          className: "block md:hidden",
                                          children: (0, s.jsx)(
                                            (e) => {
                                              let t,
                                                {
                                                  tokenData: a,
                                                  node: n,
                                                  onClose: l,
                                                  onCenter: o,
                                                } = e;
                                              if (!n) return null;
                                              let c = (0, i.useRef)(null),
                                                [d, x] = (0, i.useState)(
                                                  () =>
                                                    "true" ===
                                                    localStorage.getItem(
                                                      "tooltipExpanded"
                                                    )
                                                ),
                                                [m, u] = (0, i.useState)(!1),
                                                [h, f] = (0, i.useState)(!0);
                                              (0, i.useEffect)(() => {
                                                d
                                                  ? (f(!0),
                                                    setTimeout(() => {
                                                      f(!1);
                                                    }, 100))
                                                  : f(!1);
                                              }, []);
                                              let g = (0, i.useCallback)(
                                                (e) => {
                                                  var t;
                                                  let a = e.target,
                                                    s = !(null ===
                                                      (t = c.current) ||
                                                    void 0 === t
                                                      ? void 0
                                                      : t.contains(a)),
                                                    n =
                                                      !a.closest("button") &&
                                                      !a.closest(
                                                        ".interactive-element-class"
                                                      ),
                                                    i =
                                                      getComputedStyle(
                                                        a
                                                      ).backgroundColor;
                                                  s &&
                                                    n &&
                                                    ("rgb(18, 24, 39)" === i ||
                                                      "rgba(0, 0, 0, 0)" ===
                                                        i) &&
                                                    l();
                                                },
                                                [l]
                                              );
                                              (0, i.useEffect)(
                                                () => (
                                                  document.addEventListener(
                                                    "mousedown",
                                                    g
                                                  ),
                                                  () => {
                                                    document.removeEventListener(
                                                      "mousedown",
                                                      g
                                                    );
                                                  }
                                                ),
                                                [g]
                                              );
                                              let b = () => {
                                                  let e = !d;
                                                  x(e),
                                                    localStorage.setItem(
                                                      "tooltipExpanded",
                                                      e.toString()
                                                    );
                                                },
                                                v = t6.includes(n.index),
                                                j = V(
                                                  n.address,
                                                  e0.nodes,
                                                  e4,
                                                  e6
                                                ),
                                                N = v ? "#374151" : j,
                                                k =
                                                  ((t = n.index),
                                                  null == e0
                                                    ? void 0
                                                    : e0.links.some((e) => {
                                                        let a =
                                                            "object" ==
                                                            typeof e.source
                                                              ? e.source.index
                                                              : e.source,
                                                          s =
                                                            "object" ==
                                                            typeof e.target
                                                              ? e.target.index
                                                              : e.target,
                                                          n =
                                                            a === t || s === t,
                                                          l =
                                                            t6.includes(a) ||
                                                            t6.includes(s);
                                                        return n && !l;
                                                      })),
                                                _ =
                                                  (0, p.jw)(
                                                    n.address,
                                                    (null == a
                                                      ? void 0
                                                      : a.name.toLowerCase()) ||
                                                      "ethereum"
                                                  ) || n.address,
                                                S = (e) => {
                                                  let t =
                                                    document.createElement(
                                                      "textarea"
                                                    );
                                                  (t.value = e),
                                                    (t.style.position =
                                                      "fixed"),
                                                    (t.style.left = "-9999px"),
                                                    document.body.appendChild(
                                                      t
                                                    ),
                                                    t.select();
                                                  try {
                                                    let e =
                                                      document.execCommand(
                                                        "copy"
                                                      );
                                                    console.log(
                                                      "Fallback: Copying text command was ".concat(
                                                        e
                                                          ? "successful"
                                                          : "unsuccessful"
                                                      )
                                                    ),
                                                      r.Am.success(
                                                        "Address copied",
                                                        {
                                                          containerId: "first",
                                                        }
                                                      );
                                                  } catch (e) {
                                                    console.error(
                                                      "Fallback: Unable to copy",
                                                      e
                                                    ),
                                                      r.Am.error(
                                                        "Couldn't copy address",
                                                        {
                                                          containerId: "first",
                                                        }
                                                      );
                                                  }
                                                  document.body.removeChild(t);
                                                },
                                                C = (e) => {
                                                  navigator.clipboard &&
                                                  navigator.clipboard.writeText
                                                    ? navigator.clipboard
                                                        .writeText(e)
                                                        .then(() => {
                                                          r.Am.success(
                                                            "Address copied",
                                                            {
                                                              containerId:
                                                                "first",
                                                            }
                                                          );
                                                        })
                                                        .catch((t) => {
                                                          console.error(
                                                            "Clipboard API failed, trying fallback: ",
                                                            t
                                                          ),
                                                            S(e);
                                                        })
                                                    : S(e);
                                                },
                                                I =
                                                  "/api/proxy-logo?address=".concat(
                                                    null == n
                                                      ? void 0
                                                      : n.address
                                                  ),
                                                [L, A] = (0, i.useState)(!1);
                                              return (0, s.jsx)(T.E.div, {
                                                className:
                                                  "fixed bottom-0 left-0 right-0 top-auto !z-10 flex w-full justify-center",
                                                ref: c,
                                                children: (0, s.jsxs)(T.E.div, {
                                                  className:
                                                    "relative m-2 w-full max-w-full rounded-md bg-[#1C2433] py-4 pl-3 text-white",
                                                  style: {
                                                    maxWidth:
                                                      "calc(100% - 15px)",
                                                  },
                                                  initial: {
                                                    height: 64,
                                                  },
                                                  animate: {
                                                    height: d ? 140 : 64,
                                                  },
                                                  transition: {
                                                    duration: h ? 0 : 0.2,
                                                    ease: "easeInOut",
                                                  },
                                                  children: [
                                                    (0, s.jsxs)("button", {
                                                      onClick: (e) => {
                                                        e.stopPropagation(),
                                                          b();
                                                      },
                                                      className:
                                                        "absolute -top-7 right-0 flex h-8 min-w-[115px] content-center items-center justify-center gap-2 rounded-tl-lg rounded-tr-lg  bg-[#1C2433]",
                                                      style: {
                                                        zIndex: 10,
                                                      },
                                                      children: [
                                                        (0, s.jsx)("div", {
                                                          className:
                                                            "Expand pl-2 pr-2 font-['Inter'] text-xxs leading-3 text-gray-400",
                                                          children: d
                                                            ? "Collapse"
                                                            : "Expand",
                                                        }),
                                                        (0, s.jsx)("div", {
                                                          className:
                                                            "tooltip-chevron-up relative h-4 w-4 transition-transform ".concat(
                                                              d
                                                                ? ""
                                                                : "rotate-180"
                                                            ),
                                                          style: {
                                                            marginLeft: d
                                                              ? "4px"
                                                              : "8px",
                                                          },
                                                        }),
                                                      ],
                                                    }),
                                                    (0, s.jsx)("div", {
                                                      className:
                                                        "relative overflow-hidden",
                                                      children: (0, s.jsxs)(
                                                        "div",
                                                        {
                                                          className:
                                                            "flex flex-col",
                                                          children: [
                                                            (0, s.jsxs)("div", {
                                                              className:
                                                                "flex h-full items-center justify-between",
                                                              children: [
                                                                (0, s.jsxs)(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "flex min-w-0 items-center gap-2",
                                                                    children: [
                                                                      (0,
                                                                      s.jsxs)(
                                                                        "div",
                                                                        {
                                                                          className:
                                                                            "relative h-9 w-9 flex-shrink-0 rounded-3xl",
                                                                          children:
                                                                            [
                                                                              !L &&
                                                                                (0,
                                                                                s.jsx)(
                                                                                  "div",
                                                                                  {
                                                                                    className:
                                                                                      "absolute left-0 top-0 h-[98%] w-[98%] rounded-full bg-gray-700",
                                                                                  }
                                                                                ),
                                                                              (0,
                                                                              s.jsx)(
                                                                                "img",
                                                                                {
                                                                                  className:
                                                                                    "h-9 w-9 rounded-3xl",
                                                                                  src: I,
                                                                                  alt: n.name,
                                                                                  onLoad:
                                                                                    () => {
                                                                                      A(
                                                                                        !0
                                                                                      );
                                                                                    },
                                                                                  style:
                                                                                    {
                                                                                      visibility:
                                                                                        L
                                                                                          ? "visible"
                                                                                          : "hidden",
                                                                                    },
                                                                                }
                                                                              ),
                                                                            ],
                                                                        }
                                                                      ),
                                                                      (0,
                                                                      s.jsxs)(
                                                                        "div",
                                                                        {
                                                                          className:
                                                                            "flex min-w-0 flex-col",
                                                                          children:
                                                                            [
                                                                              (0,
                                                                              s.jsxs)(
                                                                                "div",
                                                                                {
                                                                                  className:
                                                                                    "flex min-w-0 items-center gap-0.5",
                                                                                  children:
                                                                                    [
                                                                                      (0,
                                                                                      s.jsx)(
                                                                                        "span",
                                                                                        {
                                                                                          className:
                                                                                            "max-w-full overflow-hidden truncate whitespace-nowrap font-['Inter'] text-xs font-semibold text-white",
                                                                                          children:
                                                                                            n.name
                                                                                              ? n.name
                                                                                              : (0,
                                                                                                y.ys)(
                                                                                                  _
                                                                                                ),
                                                                                        }
                                                                                      ),
                                                                                      (0,
                                                                                      s.jsx)(
                                                                                        "button",
                                                                                        {
                                                                                          className:
                                                                                            "duplicate-filled-gray relative h-[18px] w-[18px] flex-shrink-0",
                                                                                          onClick:
                                                                                            () =>
                                                                                              C(
                                                                                                _
                                                                                              ),
                                                                                        }
                                                                                      ),
                                                                                    ],
                                                                                }
                                                                              ),
                                                                              (0,
                                                                              s.jsxs)(
                                                                                "div",
                                                                                {
                                                                                  className:
                                                                                    "flex items-center gap-1 text-xxs",
                                                                                  children:
                                                                                    [
                                                                                      (0,
                                                                                      s.jsx)(
                                                                                        "span",
                                                                                        {
                                                                                          className:
                                                                                            "text-gray-400",
                                                                                          children:
                                                                                            "Cluster(%)",
                                                                                        }
                                                                                      ),
                                                                                      (0,
                                                                                      s.jsxs)(
                                                                                        "span",
                                                                                        {
                                                                                          className:
                                                                                            "font-white font-semibold",
                                                                                          style:
                                                                                            {
                                                                                              color:
                                                                                                "clusters" ===
                                                                                                tu
                                                                                                  ? "#374151" ===
                                                                                                    N
                                                                                                    ? "#FFF"
                                                                                                    : N
                                                                                                  : "#FFF",
                                                                                            },
                                                                                          children:
                                                                                            [
                                                                                              " ",
                                                                                              !v &&
                                                                                              "clusters" ===
                                                                                                tu &&
                                                                                              n.clusterPercentage &&
                                                                                              k
                                                                                                ? n.clusterPercentage.toFixed(
                                                                                                    2
                                                                                                  )
                                                                                                : n.percentage.toFixed(
                                                                                                    2
                                                                                                  ),
                                                                                              "%",
                                                                                            ],
                                                                                        }
                                                                                      ),
                                                                                    ],
                                                                                }
                                                                              ),
                                                                            ],
                                                                        }
                                                                      ),
                                                                    ],
                                                                  }
                                                                ),
                                                                (0, s.jsx)(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "min-w-[4px] flex-grow",
                                                                  }
                                                                ),
                                                                (0, s.jsxs)(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      "flex items-center",
                                                                    children: [
                                                                      aG &&
                                                                        (0,
                                                                        s.jsxs)(
                                                                          s.Fragment,
                                                                          {
                                                                            children:
                                                                              [
                                                                                (0,
                                                                                s.jsxs)(
                                                                                  "button",
                                                                                  {
                                                                                    className:
                                                                                      "flex flex-col items-center px-[17px]",
                                                                                    onClick:
                                                                                      (
                                                                                        e
                                                                                      ) => {
                                                                                        e.stopPropagation(),
                                                                                          aU(
                                                                                            n.address,
                                                                                            ex,
                                                                                            em
                                                                                          );
                                                                                      },
                                                                                    children:
                                                                                      [
                                                                                        (0,
                                                                                        s.jsx)(
                                                                                          "div",
                                                                                          {
                                                                                            className:
                                                                                              "tooltip-analytics relative h-5 w-5",
                                                                                          }
                                                                                        ),
                                                                                        (0,
                                                                                        s.jsx)(
                                                                                          "span",
                                                                                          {
                                                                                            className:
                                                                                              "mt-[2px] text-xxxs font-medium text-gray-400",
                                                                                            children:
                                                                                              "Analytics",
                                                                                          }
                                                                                        ),
                                                                                      ],
                                                                                  }
                                                                                ),
                                                                                (0,
                                                                                s.jsx)(
                                                                                  "div",
                                                                                  {
                                                                                    className:
                                                                                      "w-px self-stretch bg-gray-700",
                                                                                  }
                                                                                ),
                                                                              ],
                                                                          }
                                                                        ),
                                                                      !t6.includes(
                                                                        n.index
                                                                      ) &&
                                                                        (0,
                                                                        s.jsxs)(
                                                                          s.Fragment,
                                                                          {
                                                                            children:
                                                                              [
                                                                                (0,
                                                                                s.jsxs)(
                                                                                  "button",
                                                                                  {
                                                                                    className:
                                                                                      "flex flex-col items-center px-[18px] ",
                                                                                    onClick:
                                                                                      (
                                                                                        e
                                                                                      ) => {
                                                                                        e.stopPropagation(),
                                                                                          o(
                                                                                            n.index
                                                                                          );
                                                                                      },
                                                                                    children:
                                                                                      [
                                                                                        (0,
                                                                                        s.jsx)(
                                                                                          "div",
                                                                                          {
                                                                                            className:
                                                                                              "search relative h-[18px] w-[17px]",
                                                                                          }
                                                                                        ),
                                                                                        (0,
                                                                                        s.jsx)(
                                                                                          "span",
                                                                                          {
                                                                                            className:
                                                                                              "mt-1 text-xxxs font-medium text-gray-400",
                                                                                            children:
                                                                                              "Zoom",
                                                                                          }
                                                                                        ),
                                                                                      ],
                                                                                  }
                                                                                ),
                                                                                (0,
                                                                                s.jsx)(
                                                                                  "div",
                                                                                  {
                                                                                    className:
                                                                                      "w-px self-stretch bg-gray-700",
                                                                                  }
                                                                                ),
                                                                              ],
                                                                          }
                                                                        ),
                                                                      (0,
                                                                      s.jsxs)(
                                                                        "button",
                                                                        {
                                                                          className:
                                                                            "flex flex-col items-center px-[17px]",
                                                                          onClick:
                                                                            (
                                                                              e
                                                                            ) => {
                                                                              e.stopPropagation(),
                                                                                aC(
                                                                                  n.index
                                                                                );
                                                                            },
                                                                          children:
                                                                            [
                                                                              (0,
                                                                              s.jsx)(
                                                                                "div",
                                                                                {
                                                                                  className:
                                                                                    "tooltip-eye relative h-[18px] w-[18px]",
                                                                                  children:
                                                                                    t6.includes(
                                                                                      n.index
                                                                                    )
                                                                                      ? (0,
                                                                                        s.jsx)(
                                                                                          "div",
                                                                                          {
                                                                                            className:
                                                                                              "tooltip-eyeOff h-[18px] w-[18px] text-gray-500 opacity-50",
                                                                                          }
                                                                                        )
                                                                                      : (0,
                                                                                        s.jsx)(
                                                                                          "div",
                                                                                          {
                                                                                            className:
                                                                                              "tooltip-eyeOn h-[18px] w-[18px] text-gray-500 ".concat(
                                                                                                tf ===
                                                                                                  n.index
                                                                                                  ? "opacity-100"
                                                                                                  : "opacity-50"
                                                                                              ),
                                                                                          }
                                                                                        ),
                                                                                }
                                                                              ),
                                                                              (0,
                                                                              s.jsx)(
                                                                                "span",
                                                                                {
                                                                                  className:
                                                                                    "mt-1 text-xxxs font-medium text-gray-400",
                                                                                  children:
                                                                                    "Hide",
                                                                                }
                                                                              ),
                                                                            ],
                                                                        }
                                                                      ),
                                                                    ],
                                                                  }
                                                                ),
                                                              ],
                                                            }),
                                                            (0, s.jsx)("div", {
                                                              className:
                                                                "relative overflow-hidden",
                                                              style: {
                                                                maxHeight: d
                                                                  ? "100px"
                                                                  : "0px",
                                                                transition:
                                                                  "max-height 0.1s ease-in-out",
                                                                paddingTop:
                                                                  "12px",
                                                              },
                                                              children: (0,
                                                              s.jsx)(T.E.div, {
                                                                initial: {
                                                                  opacity: h
                                                                    ? 1
                                                                    : 0,
                                                                  y: h
                                                                    ? 0
                                                                    : -10,
                                                                },
                                                                animate: {
                                                                  opacity: d
                                                                    ? 1
                                                                    : 0,
                                                                  y: d
                                                                    ? 0
                                                                    : -10,
                                                                },
                                                                exit: {
                                                                  opacity: 0,
                                                                  y: -10,
                                                                },
                                                                transition: {
                                                                  duration: h
                                                                    ? 0
                                                                    : 0.1,
                                                                  ease: "easeInOut",
                                                                },
                                                                children: (0,
                                                                s.jsxs)("div", {
                                                                  className:
                                                                    "flex flex-col gap-2",
                                                                  children: [
                                                                    (0, s.jsxs)(
                                                                      "div",
                                                                      {
                                                                        className:
                                                                          "flex flex-wrap gap-2",
                                                                        children:
                                                                          [
                                                                            [
                                                                              {
                                                                                prop: "is_burn",
                                                                                label:
                                                                                  "Burn",
                                                                              },
                                                                              {
                                                                                prop: "is_lock",
                                                                                label:
                                                                                  "Token Lock",
                                                                              },
                                                                              {
                                                                                prop: "is_pair",
                                                                                label:
                                                                                  "Pair",
                                                                              },
                                                                              {
                                                                                prop: "is_team",
                                                                                label:
                                                                                  "Team",
                                                                              },
                                                                              {
                                                                                prop: "is_proxy",
                                                                                label:
                                                                                  "Proxy",
                                                                              },
                                                                              {
                                                                                prop: "is_tax",
                                                                                label:
                                                                                  "Tax",
                                                                              },
                                                                              {
                                                                                prop: "is_contract",
                                                                                label:
                                                                                  "Smart Contract",
                                                                              },
                                                                              {
                                                                                prop: "is_exchange",
                                                                                label:
                                                                                  "Exchange",
                                                                              },
                                                                              {
                                                                                prop: "is_presale",
                                                                                label:
                                                                                  "Presale",
                                                                              },
                                                                            ]
                                                                              .filter(
                                                                                (
                                                                                  e
                                                                                ) => {
                                                                                  let {
                                                                                    prop: t,
                                                                                  } =
                                                                                    e;
                                                                                  return n[
                                                                                    t
                                                                                  ];
                                                                                }
                                                                              )
                                                                              .map(
                                                                                (
                                                                                  e
                                                                                ) => {
                                                                                  let {
                                                                                    prop: t,
                                                                                    label:
                                                                                      a,
                                                                                  } =
                                                                                    e;
                                                                                  return (0,
                                                                                  s.jsx)(
                                                                                    "span",
                                                                                    {
                                                                                      className:
                                                                                        "rounded-full bg-[#374151] px-3 py-1 text-xxs",
                                                                                      children:
                                                                                        a,
                                                                                    },
                                                                                    t
                                                                                  );
                                                                                }
                                                                              ),
                                                                            !n.is_contract &&
                                                                              (0,
                                                                              s.jsx)(
                                                                                "span",
                                                                                {
                                                                                  className:
                                                                                    "rounded-full bg-[#374151] px-3 py-1 text-xxs",
                                                                                  children:
                                                                                    "Wallet",
                                                                                }
                                                                              ),
                                                                          ],
                                                                      }
                                                                    ),
                                                                    (0, s.jsx)(
                                                                      "div",
                                                                      {
                                                                        className:
                                                                          "flex flex-col gap-4",
                                                                        children:
                                                                          (0,
                                                                          s.jsxs)(
                                                                            "div",
                                                                            {
                                                                              className:
                                                                                "flex w-full items-center justify-around",
                                                                              children:
                                                                                [
                                                                                  (0,
                                                                                  s.jsxs)(
                                                                                    "div",
                                                                                    {
                                                                                      className:
                                                                                        "flex flex-1 flex-col items-center",
                                                                                      children:
                                                                                        [
                                                                                          (0,
                                                                                          s.jsx)(
                                                                                            "div",
                                                                                            {
                                                                                              className:
                                                                                                "whitespace-nowrap font-['Inter'] text-xs font-semibold leading-normal ".concat(
                                                                                                  n.is_proxy
                                                                                                    ? "text-[#6b7280]"
                                                                                                    : "text-white"
                                                                                                ),
                                                                                              children:
                                                                                                n.is_proxy
                                                                                                  ? "-"
                                                                                                  : "".concat(
                                                                                                      (0,
                                                                                                      w.Fw)(
                                                                                                        n.amount
                                                                                                      )
                                                                                                    ),
                                                                                            }
                                                                                          ),
                                                                                          (0,
                                                                                          s.jsx)(
                                                                                            "div",
                                                                                            {
                                                                                              className:
                                                                                                "font-['Inter'] text-xxs leading-3 text-gray-400",
                                                                                              children:
                                                                                                "Amount",
                                                                                            }
                                                                                          ),
                                                                                        ],
                                                                                    }
                                                                                  ),
                                                                                  (0,
                                                                                  s.jsx)(
                                                                                    "div",
                                                                                    {
                                                                                      className:
                                                                                        "mx-1 h-[34px] w-px bg-gray-700",
                                                                                    }
                                                                                  ),
                                                                                  (0,
                                                                                  s.jsxs)(
                                                                                    "div",
                                                                                    {
                                                                                      className:
                                                                                        "flex flex-1 flex-col items-center",
                                                                                      children:
                                                                                        [
                                                                                          (0,
                                                                                          s.jsx)(
                                                                                            "div",
                                                                                            {
                                                                                              className:
                                                                                                "font-['Inter'] text-xs font-semibold leading-normal ".concat(
                                                                                                  n.is_proxy
                                                                                                    ? "text-[#6b7280]"
                                                                                                    : "text-emerald-600"
                                                                                                ),
                                                                                              children:
                                                                                                n.is_proxy
                                                                                                  ? "-"
                                                                                                  : "".concat(
                                                                                                      (0,
                                                                                                      w.xS)(
                                                                                                        n.amount_usd
                                                                                                      )
                                                                                                    ),
                                                                                            }
                                                                                          ),
                                                                                          (0,
                                                                                          s.jsx)(
                                                                                            "div",
                                                                                            {
                                                                                              className:
                                                                                                "font-['Inter'] text-xxs leading-3 text-gray-400",
                                                                                              children:
                                                                                                "Total Value",
                                                                                            }
                                                                                          ),
                                                                                        ],
                                                                                    }
                                                                                  ),
                                                                                  (0,
                                                                                  s.jsx)(
                                                                                    "div",
                                                                                    {
                                                                                      className:
                                                                                        "mx-1 h-[34px] w-px bg-gray-700",
                                                                                    }
                                                                                  ),
                                                                                  (0,
                                                                                  s.jsxs)(
                                                                                    "div",
                                                                                    {
                                                                                      className:
                                                                                        "flex flex-1 flex-col items-center",
                                                                                      children:
                                                                                        [
                                                                                          (0,
                                                                                          s.jsxs)(
                                                                                            "div",
                                                                                            {
                                                                                              className:
                                                                                                "font-['Inter'] text-xs font-semibold leading-normal text-white",
                                                                                              children:
                                                                                                [
                                                                                                  n.percentage.toFixed(
                                                                                                    2
                                                                                                  ),
                                                                                                  "%",
                                                                                                ],
                                                                                            }
                                                                                          ),
                                                                                          (0,
                                                                                          s.jsx)(
                                                                                            "div",
                                                                                            {
                                                                                              className:
                                                                                                "font-['Inter'] text-xxs leading-3 text-gray-400",
                                                                                              children:
                                                                                                "Amount (%)",
                                                                                            }
                                                                                          ),
                                                                                        ],
                                                                                    }
                                                                                  ),
                                                                                ],
                                                                            }
                                                                          ),
                                                                      }
                                                                    ),
                                                                  ],
                                                                }),
                                                              }),
                                                            }),
                                                          ],
                                                        }
                                                      ),
                                                    }),
                                                  ],
                                                }),
                                              });
                                            },
                                            {
                                              tokenData: tJ,
                                              node: e0.nodes[tf],
                                              onClose: () => tg(null),
                                              onCenter: () => aP(e0.nodes[tf]),
                                            }
                                          ),
                                        }),
                                      ],
                                    })),
                            ],
                          }),
                      ],
                    }),
                    !eu &&
                      (0, s.jsxs)("div", {
                        className:
                          l().dynamic([
                            ["a7665c1451593825", [_ || tw ? "10px" : "12px"]],
                          ]) + " relative",
                        children: [
                          (0, s.jsxs)("div", {
                            className:
                              l().dynamic([
                                [
                                  "a7665c1451593825",
                                  [_ || tw ? "10px" : "12px"],
                                ],
                              ]) +
                              " " +
                              "absolute top-0 pointer-events-none  transition-all "
                                .concat(
                                  _ || tw
                                    ? "duration-300"
                                    : "duration-200 md:duration-300",
                                  " ease-in-out "
                                )
                                .concat(
                                  tb
                                    ? "".concat(
                                        _ || tw
                                          ? "right-[5px] translate-x-[-305px] md:translate-x-[-185px]"
                                          : "right-[0px] translate-x-[-430px] opacity-100 md:right-[5px] md:translate-x-[-425px] md:opacity-100",
                                        " md:right-[125px]"
                                      )
                                    : "right-0 translate-x-0 opacity-100",
                                  " z-[9] flex flex-col gap-2 p-4 !will-change-transform"
                                ),
                            children: [
                              (0, s.jsxs)("div", {
                                className:
                                  l().dynamic([
                                    [
                                      "a7665c1451593825",
                                      [_ || tw ? "10px" : "12px"],
                                    ],
                                  ]) +
                                  " " +
                                  "relative z-[6] ".concat(
                                    "flex flex-col gap-2 md:flex-row-reverse md:gap-3"
                                  ),
                                children: [
                                  (0, s.jsx)("button", {
                                    onClick: M,
                                    className:
                                      l().dynamic([
                                        [
                                          "a7665c1451593825",
                                          [_ || tw ? "10px" : "12px"],
                                        ],
                                      ]) +
                                      " " +
                                      "pointer-events-auto ".concat(
                                        _
                                          ? "hidden"
                                          : "flex w-fit items-center whitespace-nowrap rounded-lg bg-[#1C2433] px-4 py-2 text-white shadow md:hidden",
                                        " h-[40px]"
                                      ),
                                    children: (0, s.jsx)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) +
                                        " " +
                                        "".concat(
                                          _ ? "" : "mr-0 md:mr-2",
                                          " h-5 w-5"
                                        ),
                                      children: (0, s.jsx)("div", {
                                        className:
                                          l().dynamic([
                                            [
                                              "a7665c1451593825",
                                              [_ || tw ? "10px" : "12px"],
                                            ],
                                          ]) +
                                          " bubblemap-closeX-inline h-5 w-5",
                                      }),
                                    }),
                                  }),
                                  !tI &&
                                    (0, s.jsxs)("button", {
                                      onClick: aM,
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) +
                                        " " +
                                        "pointer-events-auto "
                                          .concat(
                                            "flex w-fit items-center whitespace-nowrap rounded-lg px-4 py-2 text-white shadow",
                                            " "
                                          )
                                          .concat(
                                            tb
                                              ? "".concat(
                                                  _
                                                    ? "border-gray-400 bg-[#354152] md:border-0"
                                                    : "border-0 bg-[#354152] md:border-0"
                                                )
                                              : "bg-[#1C2433]",
                                            " h-[40px]"
                                          ),
                                      children: [
                                        (0, s.jsx)("div", {
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              _ ? "" : "mr-0 md:mr-2",
                                              " h-5 w-5"
                                            ),
                                          children: (0, s.jsx)("div", {
                                            className:
                                              l().dynamic([
                                                [
                                                  "a7665c1451593825",
                                                  [_ || tw ? "10px" : "12px"],
                                                ],
                                              ]) + " listIcon h-5 w-5",
                                          }),
                                        }),
                                        !_ &&
                                          (0, s.jsxs)(s.Fragment, {
                                            children: [
                                              (0, s.jsx)("span", {
                                                className:
                                                  l().dynamic([
                                                    [
                                                      "a7665c1451593825",
                                                      [
                                                        _ || tw
                                                          ? "10px"
                                                          : "12px",
                                                      ],
                                                    ],
                                                  ]) +
                                                  " hidden md:block lg:hidden",
                                                children: "List",
                                              }),
                                              (0, s.jsx)("span", {
                                                className:
                                                  l().dynamic([
                                                    [
                                                      "a7665c1451593825",
                                                      [
                                                        _ || tw
                                                          ? "10px"
                                                          : "12px",
                                                      ],
                                                    ],
                                                  ]) + " hidden lg:block",
                                                children: "Holders List",
                                              }),
                                            ],
                                          }),
                                      ],
                                    }),
                                  !Z &&
                                    (0, s.jsx)(s.Fragment, {
                                      children: at
                                        ? (0, s.jsxs)("button", {
                                            onClick: () => {
                                              tT ||
                                                "no_proxies_found" === ax ||
                                                "proxies_missing" == ax ||
                                                (tF(!0),
                                                new Promise((e) => {
                                                  if (((av.current = !0), tA))
                                                    tq(tY);
                                                  else {
                                                    var t;
                                                    let e = [
                                                        ...tY.nodes,
                                                        ...tQ.nodes,
                                                      ],
                                                      a = [
                                                        ...tY.links,
                                                        ...tQ.links,
                                                      ],
                                                      s = tY.token_links.map(
                                                        (e, t) => {
                                                          var a;
                                                          return {
                                                            ...e,
                                                            links: [
                                                              ...e.links,
                                                              ...((null ===
                                                                (a =
                                                                  tQ
                                                                    .token_links[
                                                                    t
                                                                  ]) ||
                                                              void 0 === a
                                                                ? void 0
                                                                : a.links) ||
                                                                []),
                                                            ],
                                                          };
                                                        }
                                                      ),
                                                      n = (
                                                        null == tQ
                                                          ? void 0
                                                          : null ===
                                                              (t =
                                                                tQ.categories) ||
                                                            void 0 === t
                                                          ? void 0
                                                          : t.length
                                                      )
                                                        ? tQ.categories
                                                        : tY.categories;
                                                    tq({
                                                      ...tY,
                                                      nodes: e,
                                                      links: a,
                                                      token_links: s,
                                                      categories: n,
                                                    });
                                                  }
                                                  e();
                                                }).then(() => {
                                                  var e;
                                                  null === (e = eZ.current) ||
                                                    void 0 === e ||
                                                    e.reSimulate(),
                                                    tE((e) => !e),
                                                    setTimeout(() => {
                                                      tF(!1);
                                                    }, 750);
                                                }));
                                            },
                                            disabled:
                                              es ||
                                              "no_proxies_found" === ax ||
                                              "proxies_missing" === ax ||
                                              tT ||
                                              eG ||
                                              !tJ ||
                                              ((null == tJ
                                                ? void 0
                                                : tJ.proxy_available) === !1 &&
                                                !(null == tQ
                                                  ? void 0
                                                  : tQ.proxy_available)) ||
                                              (((null == tQ
                                                ? void 0
                                                : tQ.proxy_available) ||
                                                (null == tJ
                                                  ? void 0
                                                  : tJ.proxy_available)) &&
                                                (null == tQ
                                                  ? void 0
                                                  : null === (t = tQ.nodes) ||
                                                    void 0 === t
                                                  ? void 0
                                                  : t.length) === 0),
                                            className:
                                              l().dynamic([
                                                [
                                                  "a7665c1451593825",
                                                  [_ || tw ? "10px" : "12px"],
                                                ],
                                              ]) +
                                              " " +
                                              "relative z-10 pointer-events-auto "
                                                .concat(
                                                  _
                                                    ? "flex h-10 w-fit items-center justify-center rounded-lg px-2 md:px-4 py-2 text-white shadow"
                                                    : "flex w-fit items-center whitespace-nowrap rounded-lg px-4 py-2 text-white shadow",
                                                  " "
                                                )
                                                .concat(
                                                  tA &&
                                                    (null == tQ
                                                      ? void 0
                                                      : null ===
                                                          (a = tQ.nodes) ||
                                                        void 0 === a
                                                      ? void 0
                                                      : a.some(
                                                          (e) => e.is_proxy
                                                        )) &&
                                                    "no_proxies_found" !== ax &&
                                                    "proxies_missing" !== ax
                                                    ? "bg-[#354152]"
                                                    : "bg-[#1C2433]",
                                                  " h-[40px]"
                                                ),
                                            children: [
                                              (0, s.jsxs)("div", {
                                                className:
                                                  l().dynamic([
                                                    [
                                                      "a7665c1451593825",
                                                      [
                                                        _ || tw
                                                          ? "10px"
                                                          : "12px",
                                                      ],
                                                    ],
                                                  ]) +
                                                  " " +
                                                  "".concat(
                                                    _
                                                      ? "mx-2 md:mx-0 md:mr-2"
                                                      : "mr-0 md:mr-2",
                                                    " relative h-5 w-5"
                                                  ),
                                                children: [
                                                  (0, s.jsx)("div", {
                                                    className:
                                                      l().dynamic([
                                                        [
                                                          "a7665c1451593825",
                                                          [
                                                            _ || tw
                                                              ? "10px"
                                                              : "12px",
                                                          ],
                                                        ],
                                                      ]) +
                                                      " " +
                                                      "bubblemap-proxies h-5 w-5 ".concat(
                                                        tA &&
                                                          (null == tQ
                                                            ? void 0
                                                            : null ===
                                                                (n =
                                                                  tQ.nodes) ||
                                                              void 0 === n
                                                            ? void 0
                                                            : n.some(
                                                                (e) =>
                                                                  e.is_proxy
                                                              )) &&
                                                          "no_proxies_found" !==
                                                            ax &&
                                                          "proxies_missing" !==
                                                            ax
                                                          ? ""
                                                          : "opacity-40"
                                                      ),
                                                  }),
                                                  !ax &&
                                                    (eG ||
                                                      !tJ ||
                                                      ((null == tJ
                                                        ? void 0
                                                        : tJ.proxy_available) ===
                                                        !1 &&
                                                        !(null == tQ
                                                          ? void 0
                                                          : tQ.proxy_available))) &&
                                                    !(
                                                      ((null == tQ
                                                        ? void 0
                                                        : tQ.proxy_available) ||
                                                        (null == tJ
                                                          ? void 0
                                                          : tJ.proxy_available)) &&
                                                      (null == tQ
                                                        ? void 0
                                                        : null ===
                                                            (x = tQ.nodes) ||
                                                          void 0 === x
                                                        ? void 0
                                                        : x.length) === 0
                                                    ) &&
                                                    (0, s.jsx)("div", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) +
                                                        " absolute inset-0 flex items-center justify-center md:hidden",
                                                      children: (0, s.jsx)(
                                                        "div",
                                                        {
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]) +
                                                            " h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent",
                                                        }
                                                      ),
                                                    }),
                                                  ("no_proxies_found" === ax ||
                                                    "proxies_missing" === ax ||
                                                    (((null == tQ
                                                      ? void 0
                                                      : tQ.proxy_available) ||
                                                      (null == tJ
                                                        ? void 0
                                                        : tJ.proxy_available)) &&
                                                      (null == tQ
                                                        ? void 0
                                                        : null ===
                                                            (f = tQ.nodes) ||
                                                          void 0 === f
                                                        ? void 0
                                                        : f.length) === 0)) &&
                                                    (0, s.jsx)("div", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) +
                                                        " absolute inset-0 flex items-center justify-center md:hidden",
                                                      children: (0, s.jsx)(
                                                        "svg",
                                                        {
                                                          viewBox: "0 0 24 24",
                                                          fill: "none",
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]) + " h-5 w-5",
                                                          children: (0, s.jsx)(
                                                            "path",
                                                            {
                                                              d: "M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z",
                                                              fill: "#EB3D2980",
                                                              stroke: "#1C2433",
                                                              strokeWidth: "5",
                                                              paintOrder:
                                                                "stroke",
                                                              strokeLinecap:
                                                                "square",
                                                              strokeLinejoin:
                                                                "miter",
                                                              transform:
                                                                "scale(1)",
                                                              className:
                                                                l().dynamic([
                                                                  [
                                                                    "a7665c1451593825",
                                                                    [
                                                                      _ || tw
                                                                        ? "10px"
                                                                        : "12px",
                                                                    ],
                                                                  ],
                                                                ]),
                                                            }
                                                          ),
                                                        }
                                                      ),
                                                    }),
                                                ],
                                              }),
                                              (0, s.jsx)("span", {
                                                className:
                                                  l().dynamic([
                                                    [
                                                      "a7665c1451593825",
                                                      [
                                                        _ || tw
                                                          ? "10px"
                                                          : "12px",
                                                      ],
                                                    ],
                                                  ]) +
                                                  " " +
                                                  "hidden ".concat(
                                                    _ ? "text-xs" : "",
                                                    " whitespace-nowrap md:block"
                                                  ),
                                                children:
                                                  "proxies_missing" === ax
                                                    ? "No Proxy Data"
                                                    : "no_proxies_found" ===
                                                        ax ||
                                                      (((null == tQ
                                                        ? void 0
                                                        : tQ.proxy_available) ||
                                                        (null == tJ
                                                          ? void 0
                                                          : tJ.proxy_available)) &&
                                                        (null == tQ
                                                          ? void 0
                                                          : null ===
                                                              (g = tQ.nodes) ||
                                                            void 0 === g
                                                          ? void 0
                                                          : g.length) === 0)
                                                    ? "No Proxies Found"
                                                    : !eG &&
                                                      tJ &&
                                                      ((null == tJ
                                                        ? void 0
                                                        : tJ.proxy_available) !==
                                                        !1 ||
                                                        (null == tQ
                                                          ? void 0
                                                          : tQ.proxy_available))
                                                    ? tA
                                                      ? "Proxies On"
                                                      : "Proxies Off"
                                                    : "Generating Proxies",
                                              }),
                                            ],
                                          })
                                        : (0, s.jsxs)("button", {
                                            onClick: () => eq(!0),
                                            className:
                                              l().dynamic([
                                                [
                                                  "a7665c1451593825",
                                                  [_ || tw ? "10px" : "12px"],
                                                ],
                                              ]) +
                                              " " +
                                              "".concat(
                                                _
                                                  ? "flex h-10 w-10 items-center justify-center rounded-md bg-[#1C2433] p-2 text-white shadow"
                                                  : "flex w-fit items-center whitespace-nowrap rounded-md bg-[#1C2433] px-4 py-2 text-white shadow"
                                              ),
                                            children: [
                                              (0, s.jsx)("div", {
                                                className:
                                                  l().dynamic([
                                                    [
                                                      "a7665c1451593825",
                                                      [
                                                        _ || tw
                                                          ? "10px"
                                                          : "12px",
                                                      ],
                                                    ],
                                                  ]) +
                                                  " " +
                                                  "".concat(
                                                    _ ? "" : "mr-2",
                                                    " h-5 w-5"
                                                  ),
                                                children: (0, s.jsx)("div", {
                                                  className:
                                                    l().dynamic([
                                                      [
                                                        "a7665c1451593825",
                                                        [
                                                          _ || tw
                                                            ? "10px"
                                                            : "12px",
                                                        ],
                                                      ],
                                                    ]) +
                                                    " whiteDiamond h-5 w-5",
                                                }),
                                              }),
                                              !_ &&
                                                (0, s.jsxs)(s.Fragment, {
                                                  children: [
                                                    (0, s.jsx)("span", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) +
                                                        " hidden md:block lg:hidden",
                                                      children: "Proxies",
                                                    }),
                                                    (0, s.jsx)("span", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) + " hidden lg:block",
                                                      children: "Proxies",
                                                    }),
                                                  ],
                                                }),
                                            ],
                                          }),
                                    }),
                                ],
                              }),
                              (0, s.jsxs)("div", {
                                className:
                                  l().dynamic([
                                    [
                                      "a7665c1451593825",
                                      [_ || tw ? "10px" : "12px"],
                                    ],
                                  ]) +
                                  " " +
                                  "".concat(
                                    _
                                      ? "hidden"
                                      : "relative z-[7] hidden justify-end gap-3 md:flex"
                                  ),
                                children: [
                                  (0, s.jsx)("button", {
                                    onClick: e$,
                                    className:
                                      l().dynamic([
                                        [
                                          "a7665c1451593825",
                                          [_ || tw ? "10px" : "12px"],
                                        ],
                                      ]) +
                                      " " +
                                      "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg p-2 text-white shadow ".concat(
                                        a7
                                      ),
                                    children: (0, s.jsx)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " bubblemap-minus h-5 w-5",
                                    }),
                                  }),
                                  (0, s.jsx)("button", {
                                    onClick: eQ,
                                    className:
                                      l().dynamic([
                                        [
                                          "a7665c1451593825",
                                          [_ || tw ? "10px" : "12px"],
                                        ],
                                      ]) +
                                      " " +
                                      "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg p-2 text-white shadow ".concat(
                                        a7
                                      ),
                                    children: (0, s.jsx)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " bubblemap-plus h-5 w-5",
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          !tS &&
                            (0, s.jsx)("div", {
                              className:
                                l().dynamic([
                                  [
                                    "a7665c1451593825",
                                    [_ || tw ? "10px" : "12px"],
                                  ],
                                ]) +
                                " " +
                                "bottom-0 transition-all "
                                  .concat(
                                    !ep && null !== tf && e0.nodes[tf]
                                      ? "absolute hidden md:block"
                                      : "absolute ",
                                    " "
                                  )
                                  .concat(
                                    _
                                      ? "duration-300"
                                      : "duration-250 md:duration-300",
                                    " ease-in-out "
                                  )
                                  .concat(
                                    tb
                                      ? "".concat(
                                          _ || tw
                                            ? "right-[5px] translate-x-[-305px] md:translate-x-[-185px]"
                                            : "right-[0px] translate-x-[-430px] opacity-100 md:right-[5px] md:translate-x-[-425px] md:opacity-100",
                                          " md:right-[125px]"
                                        )
                                      : "right-0 translate-x-0 opacity-100",
                                    " z-[9] flex flex-col gap-3 p-4 !will-change-transform md:z-[11]"
                                  ),
                              children: (0, s.jsxs)("div", {
                                className:
                                  l().dynamic([
                                    [
                                      "a7665c1451593825",
                                      [_ || tw ? "10px" : "12px"],
                                    ],
                                  ]) +
                                  " " +
                                  "".concat(
                                    _
                                      ? "relative z-[7] flex justify-end gap-3"
                                      : "relative z-[7] flex justify-end gap-3 ".concat(
                                          null !== tf ? "hidden" : ""
                                        )
                                  ),
                                children: [
                                  (0, s.jsx)("button", {
                                    onClick: e$,
                                    className:
                                      l().dynamic([
                                        [
                                          "a7665c1451593825",
                                          [_ || tw ? "10px" : "12px"],
                                        ],
                                      ]) +
                                      " " +
                                      "flex h-10 w-10 items-center justify-center rounded-lg p-2 text-white shadow ".concat(
                                        a7
                                      ),
                                    children: (0, s.jsx)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " bubblemap-minus h-5 w-5",
                                    }),
                                  }),
                                  (0, s.jsx)("button", {
                                    onClick: eQ,
                                    className:
                                      l().dynamic([
                                        [
                                          "a7665c1451593825",
                                          [_ || tw ? "10px" : "12px"],
                                        ],
                                      ]) +
                                      " " +
                                      "flex h-10 w-10 items-center justify-center rounded-lg p-2 text-white shadow ".concat(
                                        a7
                                      ),
                                    children: (0, s.jsx)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " bubblemap-plus h-5 w-5",
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          (0, s.jsxs)("div", {
                            style: {
                              boxShadow: "-15px 0 15px rgba(0, 0, 0, 0.2)",
                            },
                            className:
                              l().dynamic([
                                [
                                  "a7665c1451593825",
                                  [_ || tw ? "10px" : "12px"],
                                ],
                              ]) +
                              " " +
                              "no-scrollbar w-transition-all absolute right-0 !z-30 flex h-full transform duration-300 sm:duration-200 md:duration-300 ease-in-out ".concat(
                                tb
                                  ? "".concat(
                                      _ || tw
                                        ? "".concat(
                                            tj ? "w-[310px]" : "w-screen",
                                            " sm:w-[310px] px-4 md:w-[310px] md:px-3"
                                          )
                                        : "w-screen sm:w-[430px] px-4 md:w-[430px] md:px-6"
                                    )
                                  : "!m-0 !w-0 !p-0 ",
                                " flex-col overflow-hidden bg-gray-900"
                              ),
                            children: [
                              (0, s.jsx)("div", {
                                className:
                                  l().dynamic([
                                    [
                                      "a7665c1451593825",
                                      [_ || tw ? "10px" : "12px"],
                                    ],
                                  ]) + " mb-1 flex items-center pt-4",
                                children: (0, s.jsxs)("div", {
                                  className:
                                    l().dynamic([
                                      [
                                        "a7665c1451593825",
                                        [_ || tw ? "10px" : "12px"],
                                      ],
                                    ]) +
                                    " " +
                                    "relative ".concat(
                                      eL ? "" : "mb-4",
                                      " flex w-full"
                                    ),
                                  children: [
                                    (0, s.jsxs)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) +
                                        " relative flex flex-1 flex-nowrap items-center",
                                      children: [
                                        (0, s.jsx)("div", {
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) + " absolute left-2",
                                          children: (0, s.jsx)("div", {
                                            className:
                                              l().dynamic([
                                                [
                                                  "a7665c1451593825",
                                                  [_ || tw ? "10px" : "12px"],
                                                ],
                                              ]) +
                                              " " +
                                              "search-white ".concat(
                                                _ || tw
                                                  ? "h-5 w-5 md:h-4 md:w-4"
                                                  : "h-5 w-5",
                                                " opacity-30"
                                              ),
                                          }),
                                        }),
                                        (0, s.jsx)("input", {
                                          type: "text",
                                          placeholder: "Search for address...",
                                          value: eE,
                                          onChange: (e) => eT(e.target.value),
                                          onFocus: () => eP(!0),
                                          onBlur: () => eP(!1),
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "placeholder-custom h-[30px] w-full flex-nowrap whitespace-nowrap rounded-lg bg-[#354152] pl-8 pr-8 "
                                              .concat(
                                                _ || tw
                                                  ? "text-xs md:text-xxs"
                                                  : "text-xs",
                                                " text-white "
                                              )
                                              .concat(
                                                eF || eE
                                                  ? "opacity-100"
                                                  : "opacity-30"
                                              ),
                                        }),
                                        eE &&
                                          eE.length > 0 &&
                                          (0, s.jsx)("button", {
                                            onClick: () => eT(""),
                                            className:
                                              l().dynamic([
                                                [
                                                  "a7665c1451593825",
                                                  [_ || tw ? "10px" : "12px"],
                                                ],
                                              ]) + " absolute right-2",
                                            children: (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "bubblemap-closeX ".concat(
                                                  _ || tw
                                                    ? "h-[18px] w-[18px]"
                                                    : "h-5 w-5",
                                                  " opacity-100"
                                                ),
                                            }),
                                          }),
                                      ],
                                    }),
                                    (0, s.jsx)("button", {
                                      onClick: () => {
                                        eA(!eL);
                                      },
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) +
                                        " " +
                                        "ml-[12px] flex h-[30px] items-center justify-center rounded-lg px-4 ".concat(
                                          eL
                                            ? "bg-[#354152] text-white"
                                            : "bg-[#354152] text-white opacity-30"
                                        ),
                                      children: (0, s.jsx)("div", {
                                        className:
                                          l().dynamic([
                                            [
                                              "a7665c1451593825",
                                              [_ || tw ? "10px" : "12px"],
                                            ],
                                          ]) +
                                          " " +
                                          "FilterSvgWhite relative flex ".concat(
                                            _ || tw
                                              ? "h-[18px] w-[18px]"
                                              : "h-5 w-5"
                                          ),
                                      }),
                                    }),
                                    tw &&
                                      !tj &&
                                      (0, s.jsx)("button", {
                                        onClick: aM,
                                        className:
                                          l().dynamic([
                                            [
                                              "a7665c1451593825",
                                              [_ || tw ? "10px" : "12px"],
                                            ],
                                          ]) +
                                          " ml-[12px] flex h-[30px] items-center justify-center rounded-lg px-4 bg-[#354152] text-white }",
                                        children: (0, s.jsx)("div", {
                                          style: {
                                            filter: "brightness(0) invert(1)",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " bubblemap-closeX text-white opacity-100 relative flex h-[18px] w-[18px] }",
                                        }),
                                      }),
                                  ],
                                }),
                              }),
                              eL &&
                                (0, s.jsxs)("div", {
                                  className:
                                    l().dynamic([
                                      [
                                        "a7665c1451593825",
                                        [_ || tw ? "10px" : "12px"],
                                      ],
                                    ]) + " mb-4 mt-[10px]",
                                  children: [
                                    (0, s.jsxs)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " flex flex-nowrap gap-3",
                                      children: [
                                        (0, s.jsxs)("div", {
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) + " flex flex-grow gap-0.5",
                                          children: [
                                            (0, s.jsx)("button", {
                                              onClick: aR,
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "flex min-w-[60px] flex-1 flex-shrink-0 items-center justify-center rounded-l-lg "
                                                  .concat(
                                                    _ || tw
                                                      ? "h-[26px] px-3 py-1.5 text-xxs md:px-4"
                                                      : "h-[30px] px-3 py-1.5 text-xs md:px-4",
                                                    " "
                                                  )
                                                  .concat(
                                                    "group" === tm
                                                      ? "bg-[#354152] text-white"
                                                      : "bg-[#354152] text-white opacity-30"
                                                  ),
                                              children: "Group",
                                            }),
                                            (0, s.jsx)("button", {
                                              onClick: aR,
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "flex min-w-[60px] flex-1 flex-shrink-0 items-center justify-center rounded-r-lg "
                                                  .concat(
                                                    _ || tw
                                                      ? "h-[26px] px-3 py-1.5 text-xxs md:px-4"
                                                      : "h-[30px] px-3 py-1.5 text-xs md:px-4",
                                                    " "
                                                  )
                                                  .concat(
                                                    "list" === tm
                                                      ? "bg-[#354152] text-white"
                                                      : "bg-[#354152] text-white opacity-30"
                                                  ),
                                              children: "List",
                                            }),
                                          ],
                                        }),
                                        (0, s.jsxs)("div", {
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) + " flex flex-grow gap-0.5",
                                          children: [
                                            (0, s.jsx)("button", {
                                              onClick: az,
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "flex min-w-[60px] flex-1 flex-shrink-0 items-center justify-center rounded-l-lg "
                                                  .concat(
                                                    _ || tw
                                                      ? "h-[26px] px-3 py-1.5 text-xxs md:px-4"
                                                      : "h-[30px] px-3 py-1.5 text-xs md:px-4",
                                                    " "
                                                  )
                                                  .concat(
                                                    "clusters" === tu
                                                      ? "bg-[#354152] text-white"
                                                      : "bg-[#354152] text-white opacity-30"
                                                  ),
                                              children: "Clusters",
                                            }),
                                            (0, s.jsx)("button", {
                                              onClick: az,
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "flex min-w-[60px] flex-1 flex-shrink-0 items-center justify-center rounded-r-lg "
                                                  .concat(
                                                    _ || tw
                                                      ? "h-[26px] px-3 py-1.5 text-xxs md:px-4"
                                                      : "h-[30px] px-3 py-1.5 text-xs md:px-4",
                                                    " "
                                                  )
                                                  .concat(
                                                    "labels" === tu
                                                      ? "bg-[#354152] text-white"
                                                      : "bg-[#354152] text-white opacity-30"
                                                  ),
                                              children: "Labels",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, s.jsxs)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " mt-[10px] flex gap-3",
                                      children: [
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_contract"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_contract"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_contract") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Contracts",
                                            }),
                                          ],
                                        }),
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_exchange"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_exchange"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_exchange") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Exchanges",
                                            }),
                                          ],
                                        }),
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_presale"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_presale"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_presale") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Presale",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, s.jsxs)("div", {
                                      className:
                                        l().dynamic([
                                          [
                                            "a7665c1451593825",
                                            [_ || tw ? "10px" : "12px"],
                                          ],
                                        ]) + " mt-[10px] flex gap-3",
                                      children: [
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_lock"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_lock"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_lock") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Locks",
                                            }),
                                          ],
                                        }),
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_pair"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_pair"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_pair") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Pairs",
                                            }),
                                          ],
                                        }),
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_burn"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_burn"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_burn") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Burn",
                                            }),
                                          ],
                                        }),
                                        (0, s.jsxs)("button", {
                                          onClick: () => aL("is_team"),
                                          style: {
                                            minWidth: "60px",
                                          },
                                          className:
                                            l().dynamic([
                                              [
                                                "a7665c1451593825",
                                                [_ || tw ? "10px" : "12px"],
                                              ],
                                            ]) +
                                            " " +
                                            "".concat(
                                              a0("is_team"),
                                              " flex-shrink-0"
                                            ),
                                          children: [
                                            (0, s.jsx)("div", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                (a1("is_team") || ""),
                                            }),
                                            (0, s.jsx)("span", {
                                              className:
                                                l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]) +
                                                " " +
                                                "".concat(
                                                  _ || tw
                                                    ? "ml-0"
                                                    : "ml-0 md:ml-2"
                                                ),
                                              children: "Team",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              (0, s.jsx)("div", {
                                ref: tV,
                                style: {
                                  paddingBottom: "400px",
                                  height:
                                    !tb || _ || tw
                                      ? "100vh"
                                      : "calc(100vh - ".concat(
                                          eL ? "238px" : "100px",
                                          ")"
                                        ),
                                },
                                className:
                                  l().dynamic([
                                    [
                                      "a7665c1451593825",
                                      [_ || tw ? "10px" : "12px"],
                                    ],
                                  ]) +
                                  " no-scrollbar md:scrollbar overflow-clip overflow-x-hidden overflow-y-scroll pb-2",
                                children:
                                  "clusters" === tu
                                    ? (0, s.jsx)(s.Fragment, {
                                        children:
                                          "group" === tm
                                            ? (0, s.jsxs)("div", {
                                                className: l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]),
                                                children: [
                                                  !to && eR && tJ
                                                    ? (0, s.jsx)(s.Fragment, {
                                                        children: Object.keys(
                                                          aH.clusters
                                                        )
                                                          .map((e) => {
                                                            let t = parseInt(
                                                                e,
                                                                10
                                                              ),
                                                              a =
                                                                aH.clusters[t],
                                                              s = a.reduce(
                                                                (e, t) =>
                                                                  e +
                                                                  (t.percentage ||
                                                                    0),
                                                                0
                                                              );
                                                            return {
                                                              clusterId: t,
                                                              nodes: a,
                                                              totalPercentage:
                                                                s,
                                                            };
                                                          })
                                                          .sort(
                                                            (e, t) =>
                                                              t.totalPercentage -
                                                              e.totalPercentage
                                                          )
                                                          .map((e, t) => {
                                                            let {
                                                              clusterId: a,
                                                              nodes: n,
                                                              totalPercentage:
                                                                i,
                                                            } = e;
                                                            return (0, s.jsxs)(
                                                              "div",
                                                              {
                                                                className:
                                                                  l().dynamic([
                                                                    [
                                                                      "a7665c1451593825",
                                                                      [
                                                                        _ || tw
                                                                          ? "10px"
                                                                          : "12px",
                                                                      ],
                                                                    ],
                                                                  ]) + " mb-4",
                                                                children: [
                                                                  (0, s.jsxs)(
                                                                    "div",
                                                                    {
                                                                      className:
                                                                        l().dynamic(
                                                                          [
                                                                            [
                                                                              "a7665c1451593825",
                                                                              [
                                                                                _ ||
                                                                                tw
                                                                                  ? "10px"
                                                                                  : "12px",
                                                                              ],
                                                                            ],
                                                                          ]
                                                                        ) +
                                                                        " mb-[10px] flex items-center justify-between",
                                                                      children:
                                                                        [
                                                                          (0,
                                                                          s.jsxs)(
                                                                            "h3",
                                                                            {
                                                                              className:
                                                                                l().dynamic(
                                                                                  [
                                                                                    [
                                                                                      "a7665c1451593825",
                                                                                      [
                                                                                        _ ||
                                                                                        tw
                                                                                          ? "10px"
                                                                                          : "12px",
                                                                                      ],
                                                                                    ],
                                                                                  ]
                                                                                ) +
                                                                                " whitespace-nowrap text-xs font-normal text-[#d3d3d3]",
                                                                              children:
                                                                                [
                                                                                  "Cluster #",
                                                                                  t +
                                                                                    1,
                                                                                ],
                                                                            }
                                                                          ),
                                                                          (0,
                                                                          s.jsxs)(
                                                                            "span",
                                                                            {
                                                                              style:
                                                                                {
                                                                                  color:
                                                                                    "#d3d3d350",
                                                                                },
                                                                              className:
                                                                                l().dynamic(
                                                                                  [
                                                                                    [
                                                                                      "a7665c1451593825",
                                                                                      [
                                                                                        _ ||
                                                                                        tw
                                                                                          ? "10px"
                                                                                          : "12px",
                                                                                      ],
                                                                                    ],
                                                                                  ]
                                                                                ) +
                                                                                " content-end justify-end whitespace-nowrap text-right text-xs font-normal",
                                                                              children:
                                                                                [
                                                                                  i.toFixed(
                                                                                    2
                                                                                  ),
                                                                                  "%",
                                                                                ],
                                                                            }
                                                                          ),
                                                                        ],
                                                                    }
                                                                  ),
                                                                  null == n
                                                                    ? void 0
                                                                    : n.map(
                                                                        (e) =>
                                                                          (0,
                                                                          s.jsx)(
                                                                            A,
                                                                            {
                                                                              isIframe:
                                                                                _ ||
                                                                                tw,
                                                                              node: e,
                                                                              selectedNode:
                                                                                tf,
                                                                              hiddenNodes:
                                                                                t6,
                                                                              clusterAssignments:
                                                                                e6,
                                                                              nodeToCluster:
                                                                                e4,
                                                                              onClick:
                                                                                aW,
                                                                              toggleNodeVisibility:
                                                                                aC,
                                                                            },
                                                                            e.index
                                                                          )
                                                                      ),
                                                                ],
                                                              },
                                                              "cluster-".concat(
                                                                t
                                                              )
                                                            );
                                                          }),
                                                      })
                                                    : (0, s.jsxs)("div", {
                                                        className:
                                                          l().dynamic([
                                                            [
                                                              "a7665c1451593825",
                                                              [
                                                                _ || tw
                                                                  ? "10px"
                                                                  : "12px",
                                                              ],
                                                            ],
                                                          ]) + " mb-4",
                                                        children: [
                                                          (0, s.jsx)("div", {
                                                            className:
                                                              l().dynamic([
                                                                [
                                                                  "a7665c1451593825",
                                                                  [
                                                                    _ || tw
                                                                      ? "10px"
                                                                      : "12px",
                                                                  ],
                                                                ],
                                                              ]) +
                                                              " Rectangle1484 LoadingState--line mb-[10px] h-5 w-20 rounded-full bg-gray-700",
                                                          }),
                                                          (0, s.jsx)(a2, {
                                                            count: 2,
                                                            className:
                                                              l().dynamic([
                                                                [
                                                                  "a7665c1451593825",
                                                                  [
                                                                    _ || tw
                                                                      ? "10px"
                                                                      : "12px",
                                                                  ],
                                                                ],
                                                              ]),
                                                          }),
                                                          (0, s.jsx)("div", {
                                                            className:
                                                              l().dynamic([
                                                                [
                                                                  "a7665c1451593825",
                                                                  [
                                                                    _ || tw
                                                                      ? "10px"
                                                                      : "12px",
                                                                  ],
                                                                ],
                                                              ]) +
                                                              " Rectangle1484 mb-[10px] mt-6 h-5 w-20 rounded-full bg-gray-700",
                                                          }),
                                                          (0, s.jsx)(a2, {
                                                            count: 3,
                                                            className:
                                                              l().dynamic([
                                                                [
                                                                  "a7665c1451593825",
                                                                  [
                                                                    _ || tw
                                                                      ? "10px"
                                                                      : "12px",
                                                                  ],
                                                                ],
                                                              ]),
                                                          }),
                                                        ],
                                                      }),
                                                  aH.hidden.length > 0 &&
                                                    (0, s.jsxs)("div", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) + " mb-4",
                                                      children: [
                                                        (0, s.jsx)("h3", {
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]) +
                                                            " mb-[10px] mt-0 text-xs font-normal text-[#d3d3d3]",
                                                          children: "Hidden",
                                                        }),
                                                        aH.hidden.map((e) =>
                                                          (0, s.jsx)(
                                                            A,
                                                            {
                                                              isIframe: _ || tw,
                                                              node: e,
                                                              selectedNode: tf,
                                                              hiddenNodes: t6,
                                                              clusterAssignments:
                                                                e6,
                                                              nodeToCluster: e4,
                                                              onClick: aW,
                                                              toggleNodeVisibility:
                                                                aC,
                                                              color: "#374151",
                                                              isHidden: !0,
                                                            },
                                                            e.index
                                                          )
                                                        ),
                                                      ],
                                                    }),
                                                  (0, s.jsxs)("div", {
                                                    className:
                                                      l().dynamic([
                                                        [
                                                          "a7665c1451593825",
                                                          [
                                                            _ || tw
                                                              ? "10px"
                                                              : "12px",
                                                          ],
                                                        ],
                                                      ]) + " mb-4",
                                                    children: [
                                                      (0, s.jsx)("h3", {
                                                        className:
                                                          l().dynamic([
                                                            [
                                                              "a7665c1451593825",
                                                              [
                                                                _ || tw
                                                                  ? "10px"
                                                                  : "12px",
                                                              ],
                                                            ],
                                                          ]) +
                                                          " " +
                                                          "mb-[10px] whitespace-nowrap text-xs font-normal text-[#d3d3d3] ".concat(
                                                            0 ===
                                                              aH.other.length
                                                              ? "hidden"
                                                              : ""
                                                          ),
                                                        children: "Other",
                                                      }),
                                                      aH.other.map((e) =>
                                                        (0, s.jsx)(
                                                          A,
                                                          {
                                                            isIframe: _ || tw,
                                                            node: e,
                                                            selectedNode: tf,
                                                            hiddenNodes: t6,
                                                            clusterAssignments:
                                                              e6,
                                                            nodeToCluster: e4,
                                                            onClick: aW,
                                                            toggleNodeVisibility:
                                                              aC,
                                                            color: "#374151",
                                                          },
                                                          e.index
                                                        )
                                                      ),
                                                    ],
                                                  }),
                                                ],
                                              })
                                            : (0, s.jsx)("div", {
                                                className: l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]),
                                                children: to
                                                  ? (0, s.jsxs)("div", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) + " mb-4",
                                                      children: [
                                                        (0, s.jsx)("div", {
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]) +
                                                            " Rectangle1484 LoadingState--line mb-[10px] h-5 w-20 rounded-full bg-gray-700",
                                                        }),
                                                        (0, s.jsx)(a2, {
                                                          count: 5,
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]),
                                                        }),
                                                      ],
                                                    })
                                                  : aX.map((e) =>
                                                      (0, s.jsx)(
                                                        A,
                                                        {
                                                          isIframe: _ || tw,
                                                          node: e,
                                                          selectedNode: tf,
                                                          hiddenNodes: t6,
                                                          clusterAssignments:
                                                            e6,
                                                          nodeToCluster: e4,
                                                          onClick: aW,
                                                          toggleNodeVisibility:
                                                            aC,
                                                        },
                                                        e.index
                                                      )
                                                    ),
                                              }),
                                      })
                                    : (0, s.jsx)(s.Fragment, {
                                        children:
                                          "group" === tm
                                            ? (0, s.jsx)("div", {
                                                className: l().dynamic([
                                                  [
                                                    "a7665c1451593825",
                                                    [_ || tw ? "10px" : "12px"],
                                                  ],
                                                ]),
                                                children: to
                                                  ? (0, s.jsxs)("div", {
                                                      className:
                                                        l().dynamic([
                                                          [
                                                            "a7665c1451593825",
                                                            [
                                                              _ || tw
                                                                ? "10px"
                                                                : "12px",
                                                            ],
                                                          ],
                                                        ]) + " mb-4",
                                                      children: [
                                                        (0, s.jsx)("div", {
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]) +
                                                            " Rectangle1484 LoadingState--line mb-[10px] h-5 w-20 rounded-full bg-gray-700",
                                                        }),
                                                        (0, s.jsx)(a2, {
                                                          count: 5,
                                                          className:
                                                            l().dynamic([
                                                              [
                                                                "a7665c1451593825",
                                                                [
                                                                  _ || tw
                                                                    ? "10px"
                                                                    : "12px",
                                                                ],
                                                              ],
                                                            ]),
                                                        }),
                                                      ],
                                                    })
                                                  : (0, s.jsxs)(s.Fragment, {
                                                      children: [
                                                        null == tJ
                                                          ? void 0
                                                          : tJ.categories.map(
                                                              (e, t) => {
                                                                let a = aq(
                                                                  e.nodes,
                                                                  t
                                                                );
                                                                if (
                                                                  !a ||
                                                                  0 === a.length
                                                                )
                                                                  return null;
                                                                let n = e.nodes
                                                                  .filter(
                                                                    (e) => {
                                                                      var t;
                                                                      return (
                                                                        !t6.includes(
                                                                          e
                                                                        ) &&
                                                                        !eU.includes(
                                                                          null ===
                                                                            (t =
                                                                              e0
                                                                                .nodes[
                                                                                e
                                                                              ]) ||
                                                                            void 0 ===
                                                                              t
                                                                            ? void 0
                                                                            : t.address
                                                                        )
                                                                      );
                                                                    }
                                                                  )
                                                                  .reduce(
                                                                    (e, t) => {
                                                                      let a =
                                                                        e0
                                                                          .nodes[
                                                                          t
                                                                        ];
                                                                      return (
                                                                        e +
                                                                        ((null ==
                                                                        a
                                                                          ? void 0
                                                                          : a.percentage) ||
                                                                          0)
                                                                      );
                                                                    },
                                                                    0
                                                                  );
                                                                return (0,
                                                                s.jsxs)(
                                                                  "div",
                                                                  {
                                                                    className:
                                                                      l().dynamic(
                                                                        [
                                                                          [
                                                                            "a7665c1451593825",
                                                                            [
                                                                              _ ||
                                                                              tw
                                                                                ? "10px"
                                                                                : "12px",
                                                                            ],
                                                                          ],
                                                                        ]
                                                                      ) +
                                                                      " mb-4",
                                                                    children: [
                                                                      (0,
                                                                      s.jsxs)(
                                                                        "div",
                                                                        {
                                                                          className:
                                                                            l().dynamic(
                                                                              [
                                                                                [
                                                                                  "a7665c1451593825",
                                                                                  [
                                                                                    _ ||
                                                                                    tw
                                                                                      ? "10px"
                                                                                      : "12px",
                                                                                  ],
                                                                                ],
                                                                              ]
                                                                            ) +
                                                                            " mb-[10px] flex items-center justify-between",
                                                                          children:
                                                                            [
                                                                              (0,
                                                                              s.jsx)(
                                                                                "h3",
                                                                                {
                                                                                  className:
                                                                                    l().dynamic(
                                                                                      [
                                                                                        [
                                                                                          "a7665c1451593825",
                                                                                          [
                                                                                            _ ||
                                                                                            tw
                                                                                              ? "10px"
                                                                                              : "12px",
                                                                                          ],
                                                                                        ],
                                                                                      ]
                                                                                    ) +
                                                                                    " whitespace-nowrap text-xs font-normal text-[#d3d3d3]",
                                                                                  children:
                                                                                    e.name,
                                                                                }
                                                                              ),
                                                                              (0,
                                                                              s.jsxs)(
                                                                                "span",
                                                                                {
                                                                                  style:
                                                                                    {
                                                                                      color:
                                                                                        "#d3d3d350",
                                                                                    },
                                                                                  className:
                                                                                    l().dynamic(
                                                                                      [
                                                                                        [
                                                                                          "a7665c1451593825",
                                                                                          [
                                                                                            _ ||
                                                                                            tw
                                                                                              ? "10px"
                                                                                              : "12px",
                                                                                          ],
                                                                                        ],
                                                                                      ]
                                                                                    ) +
                                                                                    " whitespace-nowrap text-xs font-normal",
                                                                                  children:
                                                                                    [
                                                                                      n.toFixed(
                                                                                        2
                                                                                      ),
                                                                                      "%",
                                                                                    ],
                                                                                }
                                                                              ),
                                                                            ],
                                                                        }
                                                                      ),
                                                                      a,
                                                                    ],
                                                                  },
                                                                  e.name
                                                                );
                                                              }
                                                            ),
                                                        aQ.length > 0 &&
                                                          (0, s.jsxs)("div", {
                                                            className:
                                                              l().dynamic([
                                                                [
                                                                  "a7665c1451593825",
                                                                  [
                                                                    _ || tw
                                                                      ? "10px"
                                                                      : "12px",
                                                                  ],
                                                                ],
                                                              ]) + " mb-4",
                                                            children: [
                                                              (0, s.jsx)("h3", {
                                                                className:
                                                                  l().dynamic([
                                                                    [
                                                                      "a7665c1451593825",
                                                                      [
                                                                        _ || tw
                                                                          ? "10px"
                                                                          : "12px",
                                                                      ],
                                                                    ],
                                                                  ]) +
                                                                  " mb-[10px] whitespace-nowrap text-xs font-normal text-[#d3d3d3]",
                                                                children:
                                                                  "Hidden",
                                                              }),
                                                              aQ,
                                                            ],
                                                          }),
                                                        aZ.length > 0 &&
                                                          (0, s.jsxs)("div", {
                                                            className:
                                                              l().dynamic([
                                                                [
                                                                  "a7665c1451593825",
                                                                  [
                                                                    _ || tw
                                                                      ? "10px"
                                                                      : "12px",
                                                                  ],
                                                                ],
                                                              ]) + " mb-4",
                                                            children: [
                                                              (0, s.jsx)("h3", {
                                                                className:
                                                                  l().dynamic([
                                                                    [
                                                                      "a7665c1451593825",
                                                                      [
                                                                        _ || tw
                                                                          ? "10px"
                                                                          : "12px",
                                                                      ],
                                                                    ],
                                                                  ]) +
                                                                  " mb-[10px] whitespace-nowrap text-xs font-normal text-[#d3d3d3]",
                                                                children:
                                                                  "Other",
                                                              }),
                                                              aZ,
                                                            ],
                                                          }),
                                                      ],
                                                    }),
                                              })
                                            : (() => {
                                                if ("list" !== tm) return null;
                                                if (to)
                                                  return (0, s.jsxs)("div", {
                                                    className: "mb-4",
                                                    children: [
                                                      (0, s.jsx)("div", {
                                                        className:
                                                          "Rectangle1484 LoadingState--line mb-[10px] h-5 w-20 rounded-full bg-gray-700",
                                                      }),
                                                      (0, s.jsx)(a2, {
                                                        count: 5,
                                                      }),
                                                    ],
                                                  });
                                                let e = {};
                                                return (
                                                  null == tJ ||
                                                    tJ.categories.forEach(
                                                      (t, a) => {
                                                        let s = W(a);
                                                        t.nodes.forEach((t) => {
                                                          e[t] = s;
                                                        });
                                                      }
                                                    ),
                                                  (eE
                                                    ? aV(e0.nodes, eE)
                                                    : e0.nodes
                                                  ).map((t) => {
                                                    if (!t) return null;
                                                    let a = e[t.index];
                                                    return (0, s.jsx)(
                                                      E,
                                                      {
                                                        isIframe: _,
                                                        node: t,
                                                        selectedNode: tf,
                                                        hiddenNodes: t6,
                                                        categoryColor: a,
                                                        onClick: aW,
                                                        toggleNodeVisibility:
                                                          aC,
                                                      },
                                                      t.index
                                                    );
                                                  })
                                                );
                                              })(),
                                      }),
                              }),
                              (0, s.jsx)("button", {
                                onClick: aM,
                                className:
                                  l().dynamic([
                                    [
                                      "a7665c1451593825",
                                      [_ || tw ? "10px" : "12px"],
                                    ],
                                  ]) +
                                  " absolute bottom-0 left-0 z-50 flex h-[52px] min-h-[52px] w-full items-center justify-center bg-gray-900 p-2 text-center font-[Inter] text-sm font-semibold text-[#EB3D29] transition-none sm:hidden",
                                children: (0, s.jsx)("div", {
                                  className:
                                    l().dynamic([
                                      [
                                        "a7665c1451593825",
                                        [_ || tw ? "10px" : "12px"],
                                      ],
                                    ]) + " whitespace-nowrap text-center",
                                  children: "Close Window",
                                }),
                              }),
                            ],
                          }),
                          (0, s.jsx)(l(), {
                            id: "a7665c1451593825",
                            dynamic: [_ || tw ? "10px" : "12px"],
                            children:
                              ".placeholder-custom.__jsx-style-dynamic-selector::-webkit-input-placeholder{color:rgba(255,255,255,1)!important;font-size:"
                                .concat(
                                  _ || tw ? "10px" : "12px",
                                  '!important;font-weight:400!important;font-family:"Inter",sans-serif!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}.placeholder-custom.__jsx-style-dynamic-selector:-moz-placeholder{color:rgba(255,255,255,1)!important;font-size:'
                                )
                                .concat(
                                  _ || tw ? "10px" : "12px",
                                  '!important;font-weight:400!important;font-family:"Inter",sans-serif!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}.placeholder-custom.__jsx-style-dynamic-selector::-moz-placeholder{color:rgba(255,255,255,1)!important;font-size:'
                                )
                                .concat(
                                  _ || tw ? "10px" : "12px",
                                  '!important;font-weight:400!important;font-family:"Inter",sans-serif!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}.placeholder-custom.__jsx-style-dynamic-selector:-ms-input-placeholder{color:rgba(255,255,255,1)!important;font-size:'
                                )
                                .concat(
                                  _ || tw ? "10px" : "12px",
                                  '!important;font-weight:400!important;font-family:"Inter",sans-serif!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}.placeholder-custom.__jsx-style-dynamic-selector::-ms-input-placeholder{color:rgba(255,255,255,1)!important;font-size:'
                                )
                                .concat(
                                  _ || tw ? "10px" : "12px",
                                  '!important;font-weight:400!important;font-family:"Inter",sans-serif!important;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}.placeholder-custom.__jsx-style-dynamic-selector::placeholder{color:rgba(255,255,255,1)!important;font-size:'
                                )
                                .concat(
                                  _ || tw ? "10px" : "12px",
                                  '!important;font-weight:400!important;font-family:"Inter",sans-serif!important;white-space:nowrap!important;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis}'
                                ),
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            }),
          ],
        });
      };
    },
    12577: function (e, t, a) {
      a.d(t, {
        OG: function () {
          return i;
        },
        XL: function () {
          return r;
        },
        _v: function () {
          return n;
        },
        sk: function () {
          return l;
        },
      });
      var s = a(85893);
      let n = (e) => {
          let { content: t } = e;
          return (0, s.jsx)("div", {
            className:
              "flex w-72 flex-col gap-4 rounded-lg border border-white bg-white px-4 pb-4 pt-4 !opacity-100 shadow",
            children: (0, s.jsx)("p", {
              className:
                "text-center font-['Inter'] text-xs font-normal leading-4 text-gray-900",
              dangerouslySetInnerHTML: {
                __html: null == t ? void 0 : t.description,
              },
            }),
          });
        },
        l = (e) => {
          let { description: t } = e;
          return (0, s.jsx)("div", {
            className:
              "flex flex-col gap-4  rounded-lg border border-white bg-white px-4 pb-2 pt-2 shadow",
            children: (0, s.jsx)("p", {
              className:
                "text-left font-['Inter'] text-xs font-normal leading-4 text-gray-900",
              dangerouslySetInnerHTML: {
                __html: t,
              },
            }),
          });
        },
        i = (e) => {
          let { description: t, tier: a } = e;
          return (0, s.jsx)("div", {
            className:
              "from-0 via-43 to-100 !z-54 rounded-full bg-gradient-to-b from-[#FBBF24] via-[#FBBF24] to-[#EA580C] p-[1px]",
            children: (0, s.jsxs)("div", {
              className:
                "Premium inline-flex items-center justify-start rounded-full bg-gray-900 px-3 py-[7px] shadow",
              children: [
                (0, s.jsx)("div", {
                  className: "diamondOrange relative h-4 w-4",
                  children: (0, s.jsx)("div", {
                    className:
                      "Group850 absolute left-[1.17px] top-[1.83px] h-3 w-3.5",
                  }),
                }),
                (0, s.jsxs)("div", {
                  style: {
                    marginLeft: "4px",
                  },
                  className: "AvailableInEntryTier",
                  children: [
                    (0, s.jsxs)("span", {
                      className:
                        "font-['Inter'] text-xs font-normal leading-3 text-white",
                      children: [t, " "],
                    }),
                    (0, s.jsx)("span", {
                      className:
                        "gradient-tier-text text-xs font-medium leading-3",
                      children: a,
                    }),
                  ],
                }),
              ],
            }),
          });
        },
        r = (e) => {
          let { content: t } = e;
          return (0, s.jsx)("div", {
            className:
              "flex w-48 flex-col gap-2 rounded-lg border border-white bg-white px-2 pb-2 pt-2 !opacity-100 shadow",
            children: t.validations.map((e, t) =>
              (0, s.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2",
                  children: [
                    (0, s.jsxs)("span", {
                      className:
                        "text-left font-['Inter'] text-xs font-medium leading-tight text-gray-700 ".concat(
                          e.isValid ? "text-green-500" : "text-red-500"
                        ),
                      children: [e.isValid ? "✓" : "✕", " "],
                    }),
                    (0, s.jsx)("span", {
                      className:
                        "text-left font-['Inter'] text-xs font-medium leading-tight text-gray-700",
                      children: e.message,
                    }),
                  ],
                },
                t
              )
            ),
          });
        };
    },
  },
]);
