const AppTemplate = `

<div class="control-section" style="margin-top: 5%">
    <div align='center'>
        <ejs-chart
        style="display: block"
        theme="Material"
        align="center"
        id="chartcontainer"
        :title="title"
        :primaryXAxis="primaryXAxis"
        :primaryYAxis="primaryYAxis"
        :tooltip="tooltip"
        :chartArea="chartArea"
        width=100%>
            <e-series-collection>
                <e-series
                :dataSource="seriesData"
                type="Line"
                xName="x"
                yName="y"
                name="Germany"
                width=3
                :marker="marker"
                ></e-series>
                <e-series
                :dataSource="seriesData1"
                type="Line"
                xName="x"
                yName="y"
                name="England"
                width=3
                :marker="marker"
                ></e-series>
                <e-series
                :dataSource="seriesData2"
                type="Line"
                xName="x"
                yName="y"
                name="EUA"
                width=3
                :marker="marker"
                ></e-series>
            </e-series-collection>
        </ejs-chart>
        <br>
        <ejs-button
        ref="toggleBtn"
        cssClass="e-flat"
        :isPrimary="true"
        :isToggle="true"
        v-on:click.native="btnClickGraph"
        :contentGraph="contentValue"
        >Página do Gráfico</ejs-button>

        <ejs-button
        ref="toggleBtn"
        cssClass="e-flat"
        :isPrimary="true"
        :isToggle="true"
        v-on:click.native="btnClick"
        :content="contentValue"
        >Página de Dashboard</ejs-button>
    </div>
</div>

`;

Vue.component('AppVue', {
    template: AppTemplate,
    data: function() {
        return {
            seriesData: [
                { x: new Date(2016, 0, 1), y: 70 },
                { x: new Date(2017, 0, 1), y: 57 },
                { x: new Date(2018, 0, 1), y: 54 },
                { x: new Date(2019, 0, 1), y: 38 },
                { x: new Date(2020, 0, 1), y: 36 },
                { x: new Date(2021, 0, 1), y: 24 },
                { x: new Date(2022, 0, 1), y: 50 }
            ],
            seriesData1: [
                { x: new Date(2016, 0, 1), y: 28 },
                { x: new Date(2017, 0, 1), y: 44 },
                { x: new Date(2018, 0, 1), y: 48 },
                { x: new Date(2019, 0, 1), y: 50 },
                { x: new Date(2020, 0, 1), y: 66 },
                { x: new Date(2021, 0, 1), y: 78 },
                { x: new Date(2022, 0, 1), y: 84 }
            ],
            seriesData2: [
                { x: new Date(2016, 0, 1), y: 50 },
                { x: new Date(2017, 0, 1), y: 40 },
                { x: new Date(2018, 0, 1), y: 60 },
                { x: new Date(2019, 0, 1), y: 80 },
                { x: new Date(2020, 0, 1), y: 75 },
                { x: new Date(2021, 0, 1), y: 85 },
                { x: new Date(2022, 0, 1), y: 90 }
            ],
            //Initializing Primary X Axis
            primaryXAxis: {
                valueType: "DateTime",
                labelFormat: "y",
                intervalType: "Years",
                edgeLabelPlacement: "Shift",
                majorGridLines: { width: 0 }
            },
            //Initializing Primary Y Axis
            primaryYAxis: {
                labelFormat: "{value}%",
                rangePadding: "None",
                minimum: 0,
                maximum: 100,
                interval: 20,
                lineStyle: { width: 0 },
                majorTickLines: { width: 0 },
                minorTickLines: { width: 0 }
            },
            chartArea: {
                border: {
                    width: 0
                }
            },
            marker: {
                visible: true,
                height: 10,
                width: 10
            },
            tooltip: {
                enable: true
            },
            title: "Teste do Componente, Gráfico simples",
            // Botão para próxima página
            contentGraph: "Página do Gráfico",
            content: "Página do Dashboard"
        }
    },
    computed: {
        contentValue: {
            get: function() {
                return this.content;
            },
            set: function(content) {
                this.content = content
            }
        }
    },
    methods: {
        btnClickGraph: function(event) {
            //window.location.href = BASE + "/graphpage"
        },
        btnClick: function(event) {
            //window.location.href = BASE + "/dashboard"
        }
    }
})
