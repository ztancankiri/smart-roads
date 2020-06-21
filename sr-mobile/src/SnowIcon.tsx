import React from "react";
import Icon from '@ant-design/icons';

const SnowSvg = () => (
    <svg width="16px" height="16px" fill="currentColor" viewBox="0 0 1024 1024">
        <path d="M98.744,57.035L98.744,57.035c-0.593-1.176-2.027-1.649-3.203-1.056l-16.979,8.56L54.845,50.42  l23.525-13.572l15.66,9.041c1.141,0.658,2.599,0.268,3.257-0.873l0,0c0.658-1.141,0.268-2.599-0.873-3.257l-13.274-7.663  l8.591-4.956c1.141-0.658,1.532-2.116,0.874-3.257l0,0c-0.658-1.141-2.116-1.532-3.257-0.874l-8.749,5.048l0.484-15.813  c0.04-1.316-0.994-2.416-2.311-2.456l0,0c-1.316-0.04-2.416,0.994-2.456,2.311l-0.574,18.761L53.187,45.871V20.23l15.919-9.519  c1.13-0.676,1.499-2.14,0.823-3.271v0c-0.676-1.13-2.14-1.499-3.271-0.823l-13.471,8.055V4.121c0-1.317-1.068-2.385-2.385-2.385l0,0  c-1.317,0-2.385,1.068-2.385,2.385v10.425L35.159,6.618c-1.13-0.676-2.595-0.307-3.27,0.823l0,0  c-0.676,1.13-0.307,2.595,0.823,3.271l15.706,9.391v26.49L23.462,31.737l0.481-18.462c0.034-1.317-1.005-2.412-2.322-2.446l0,0  c-1.317-0.034-2.412,1.005-2.446,2.322L18.764,28.94l-6.506-3.873c-1.132-0.674-2.595-0.302-3.269,0.829l0,0  c-0.674,1.132-0.302,2.595,0.829,3.269l6.191,3.686L2.312,39.756c-1.176,0.593-1.649,2.027-1.056,3.203l0,0  c0.593,1.176,2.027,1.649,3.203,1.056l16.408-8.272l24.547,14.613l-22.2,12.807L7.986,53.859c-1.124-0.687-2.592-0.332-3.278,0.792  l0,0c-0.687,1.124-0.332,2.592,0.792,3.278l13.009,7.949L9.871,70.86c-1.141,0.658-1.532,2.116-0.874,3.257l0,0  c0.658,1.141,2.116,1.532,3.257,0.874l8.768-5.058l-0.883,15.885c-0.073,1.315,0.934,2.44,2.249,2.513h0  c1.315,0.073,2.44-0.934,2.513-2.249l1.056-18.996l22.46-12.958v26.594L32.46,90.264c-1.13,0.676-1.499,2.14-0.823,3.271l0,0  c0.676,1.13,2.14,1.499,3.271,0.823l13.509-8.078v9.599c0,1.317,1.068,2.385,2.385,2.385l0,0c1.317,0,2.385-1.068,2.385-2.385  v-9.426l13.22,7.905c1.13,0.676,2.595,0.307,3.271-0.823l0,0c0.676-1.13,0.307-2.595-0.823-3.271l-15.668-9.368V54.983  l23.335,13.892l-0.464,17.843c-0.034,1.317,1.005,2.412,2.322,2.446l0,0c1.317,0.034,2.412-1.005,2.446-2.322l0.395-15.17  l7.348,4.374c1.132,0.674,2.595,0.302,3.269-0.829v0c0.674-1.132,0.302-2.595-0.829-3.269l-7.588-4.517l14.269-7.193  C98.864,59.645,99.337,58.211,98.744,57.035z" />
    </svg>
);

export const SnowIcon = (props: any) => <Icon component={SnowSvg} {...props} />;
