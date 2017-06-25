import React from 'react';
import PropTypes from 'prop-types';
import wurd from '../../../../dist/wurd';


const WurdImage = (props) => {
  let {id} = props;

  let url = wurd.get(id);

  return (
    <img {...props} data-wurd-img={id} src={url} />
  );
};


export default WurdImage;
