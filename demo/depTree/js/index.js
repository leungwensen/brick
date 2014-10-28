
/* jshint strict: true, undef: true, unused: true */
/* global d3, dagreD3, $, pastry */

(function() {
    'use strict';
    /*
     * @author      : 绝云(wensen.lws@alibaba-inc.com)
     * @description : 画图
     */

    var
        // 缩放相关 {
            zoom,
        // }
        // 画图相关 {
            g,
            svg = d3.select('svg'),
            graphData = {
                nodes: [],
                links: []
            },
            layout = dagreD3.layout()
                .nodeSep(50)
                .rankSep(200)
                .rankDir('TB');
        // }

    function svgTranslate (graph, option) {
        /*
         * @description : 图形变换
         * @parameter   : {Number} x, x
         * @parameter   : {Number} y, y
         * @parameter   : {Number} scale, 缩放倍数
         * @parameter   : {Number} duration, 动画持续时间
         */
        var x        = option.x,
            y        = option.y,
            scale    = option.scale || 1,
            duration = pastry.isNumber(option.duration) ?
                option.duration : 300;

        if (pastry.isNumber(x) && pastry.isNumber(y)) {
            graph
                .transition()
                .duration(duration)
                .attr(
                    'transform',
                    'translate(' + x + ', ' + y + ')scale(' + scale + ')'
                );
            // 图在自动定位后要更新 d3.event 里缓存了的 scale 和 translate，否则会有跳动的问题 {
                zoom.translate([x, y]);
                zoom.scale(scale);
            // }
        }
    }

    function classById (id) {
        switch (true) {
            case /^core/.test(id):
                return 'type-core';
            case /^amd/.test(id):
                return 'type-core';
            case /shim\//.test(id):
                return 'type-common';
            case /fmt\//.test(id):
                return 'type-common';
            default:
                return 'type-default';
        }
    }

    function processNodes (nodes) {
        pastry.each(nodes, function(node) {
            pastry.extend(node, {
                label     : node.name,
                nodeclass : classById(node.id)
            });
        });
    }

    function draw (graph) {
        /*
         * @description: 画图
         */
        g = new dagreD3.Digraph();
        // 加 node {
            pastry.each(graph.nodes, function(node) {
                if (node.id) {
                    g.addNode(node.id,  node);
                }
            });
        // }
        // 加 link {
            pastry.each(graph.links, function(link) {
                g.addEdge(link.id, link.source, link.target);
            });
        // }
        // 画图 {
            var renderer     = new dagreD3.Renderer(),
                oldDrawNodes = renderer.drawNodes();
        // }
        // 定制 node {
            renderer.drawNodes(function(graph, root) {
                var svgNodes = oldDrawNodes(graph, root);
                svgNodes.each(function(u) {
                    d3.select(this).classed(graph.node(u).nodeclass, true);
                });
                return svgNodes;
            });
        // }
        // zooming {
            var graphLayout = renderer
                    .layout(layout)
                    .run(g, d3.select('svg')),
                zoomed = function () {
                    svg.select('g')
                        .attr(
                            'transform',
                            'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')'
                        );
                };
            zoom = d3.behavior.zoom()
                .scaleExtent([0.2, 3])
                .on('zoom', zoomed);
            svg.call(zoom);
        // }
        // 居中 {
            svgTranslate(svg.select('g'), {
                x: (($('#canvas').width()  - graphLayout.graph().width)  / 2),
                y: (($('#canvas').height() - graphLayout.graph().height) / 2),
            });
        // }
    }
    function initNamespaces () {
        var id,
            result = [];
        pastry.each(graphData.nodes, function(node) {
            id = node.id;
            if (pastry.isString(id)) {
                result.push(id.split('/')[0]);
            }
        });
    }

    $.get('./json/nodes.json', function(nodes) {
        $.get('./json/links.json', function(links) {
            // 备份图数据 {
                processNodes(nodes);
                graphData = {
                    nodes: nodes,
                    links: links
                };
            // }
            // 生成 namespaces 菜单 {
                initNamespaces();
            // }
            // 画图 {
                draw(graphData);
            // }
        });
    });
}());

