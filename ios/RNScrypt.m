//
//  RNScrypt.m
//  RNScrypt
//
//  Created by Yiorgis Gozadinos on 23/11/2017.
//  Copyright © 2017 Crypho AS. All rights reserved.
//


#import "RNScrypt.h"
#import "libscrypt.h"
#import <Foundation/Foundation.h>

#include <stdbool.h>
#include <stdint.h>

@implementation RNScrypt

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(scrypt, scrypt:(NSString *)passwd
                 salt:(NSString *)salt
                 N:(NSUInteger)N
                 r:(NSUInteger)r
                 p:(NSUInteger)p
                 dkLen:(NSUInteger)dkLen
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    int i, success;
    uint8_t hashbuf[dkLen];

    const char *chars_passwd = [passwd UTF8String];
    int j = 0;
    long len_passwd = passwd.length;
    uint8_t *passwd_buffer = malloc(sizeof(uint8_t) * len_passwd / 2);

    char byteChars[3] = {'\0','\0','\0'};
    unsigned long wholeByte;

    while (j < len_passwd) {
        byteChars[0] = chars_passwd[j++];
        byteChars[1] = chars_passwd[j++];
        wholeByte = strtoul(byteChars, NULL, 16);
        passwd_buffer[(j / 2) - 1] = wholeByte;
    }

    const char *chars_salt = [salt UTF8String];
    j = 0;
    long len_salt = salt.length;
    uint8_t *salt_buffer = malloc(sizeof(uint8_t) * len_salt / 2);

    while (j < len_salt) {
        byteChars[0] = chars_salt[j++];
        byteChars[1] = chars_salt[j++];
        wholeByte = strtoul(byteChars, NULL, 16);
        salt_buffer[(j / 2) - 1] = wholeByte;
    }

    @try {
        success = libscrypt_scrypt((uint8_t *) passwd_buffer, len_passwd / 2, (uint8_t *) salt_buffer, len_salt / 2, N, r, p, hashbuf, dkLen);
    }
    @catch (NSException * e) {
        NSError *error = [NSError errorWithDomain:@"com.crypho.scrypt" code:200 userInfo:@{@"Error reason": @"Error in scrypt"}];
        reject(@"Failure in scrypt", @"Error", error);
    }

    NSMutableString *hexResult = [NSMutableString stringWithCapacity:dkLen * 2];
    for(i = 0;i < dkLen; i++ )
    {
        [hexResult appendFormat:@"%02x", hashbuf[i]];
    }
    NSString *result = [NSString stringWithString: hexResult];
    resolve(result);
    free(passwd_buffer);
    free(salt_buffer);
}

@end
