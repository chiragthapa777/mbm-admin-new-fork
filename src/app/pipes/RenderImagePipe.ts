import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'renderImage',
})
export class RenderImagePipe implements PipeTransform {
  transform(imageName: string, type: string): string {
    console.log(type, 'IMAGE TYPEEEEEE');

    console.log('GOT IMAGE X', imageName);
    let CloudFrontUrl = 'https://d2mo2xp2vmmjdo.cloudfront.net';
    const imageRequest = JSON.stringify({
      bucket: 'mbm-test',
      key: 'images/original/' + imageName,
      edits: {
        contentModeration: {
          minConfidence: 90, // minimum confidence level for inappropriate content
          blur: 0, // amount to blur image
          moderationLabels: ['Smoking'],
        },
      },
    });

 

    if (!imageName.startsWith('https'))
      imageName = `${CloudFrontUrl}/${btoa(imageRequest)}`;

    return imageName;
  }
}
