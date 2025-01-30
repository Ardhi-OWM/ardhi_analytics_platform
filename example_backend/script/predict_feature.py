#-------------------------------------------------------------------------------
# Name:        predict_feature
# Purpose:
#
# Author:      caleb
#
# Created:     19/01/2025
# Copyright:   (c) caleb 2025
# Licence:     <ardhi>
#-------------------------------------------------------------------------------

import os

from keras.models import load_model

import numpy as np

import rasterio as rio
from rasterio.transform import Affine
from matplotlib import pyplot as plt


def predict_masks(input_raster_folder,output_mask_folder,unet_model_file,feature_type='bounds'): #feature_type can either be bounds or masks
    #####to hold data crucial for georeferencing and writing the patches to file
    coord_sys_list=[]
    pixel_size_xy_list=[]
    upper_coords_xy_list=[]

    ###to hold the raster arrays
    raster_array_list=[]


    input_raster_path_list=[image_file for image_file in os.listdir(input_raster_folder) if image_file.endswith('.tif')]


    for i in range(len(input_raster_path_list)):


        input_raster_path=input_raster_folder+ '/'+ input_raster_path_list[i]
        print(input_raster_path)
        image=rio.open(input_raster_path)
        red_array=image.read(1)
        blue_array=image.read(2)
        green_array=image.read(3)

        rgb_array=np.dstack((red_array,blue_array,green_array))
        coord_system=image.crs
        upper_left_coord=[image.bounds.left, image.bounds.top]
        pixel_res=[image.res[0],image.res[1]]

        coord_sys_list.append(coord_system)
        pixel_size_xy_list.append(pixel_res)
        upper_coords_xy_list.append(upper_left_coord)
        raster_array_list.append(rgb_array)







    #convert the raster list into one general array
    raster_array=np.array(raster_array_list)


    #use the trained model to predict for masks
    model = load_model(unet_model_file)
    y_pred=model.predict(raster_array)
    y_pred_argmax=np.argmax(y_pred,axis=3) #get mask values

    print(len(y_pred))

    #Write predicted masks to a folder

    for k in range(len(y_pred)):
        #create an affine transform file
        transform_file= Affine(pixel_size_xy_list[k][0],0,upper_coords_xy_list[k][0],0,-(pixel_size_xy_list[k][1]),upper_coords_xy_list[k][1])

        with rio.open(output_mask_folder+'/{}_{}_mask.tif'.format(input_raster_path_list[k].rstrip('.tif'),feature_type),'w',driver='GTIFF',height= raster_array_list[k].shape[0],width=raster_array_list[k].shape[1],count=1,dtype=raster_array_list[k].dtype,crs=coord_sys_list[k],transform=transform_file) as dst:
            predicted_masks=y_pred_argmax[k]#.reshape(512,512,1)
            predicted_masks=predicted_masks.astype('uint8')
            dst.write(predicted_masks,1) #reshape into a 2d file. it will be the 1st band.





#example
###load data
##unet_model_file=r''
##input_raster_folder=r''
##output_mask_folder=r''
##
##predict_masks(input_raster_folder,output_mask_folder,unet_model_file)